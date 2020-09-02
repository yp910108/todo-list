;(function () {
  var LIST = [
    { id: 1, name: '测试名称1', desc: '测试描述1' },
    { id: 2, name: '测试名称2', desc: '测试描述2' },
    { id: 3, name: '测试名称3', desc: '测试描述3' },
    { id: 4, name: '测试名称4', desc: '测试描述4' },
    { id: 5, name: '测试名称5', desc: '测试描述5' }
  ];
  var MODAL_TEMPLATE = [
    '<div class="form-item is-required">',
    '<label>名称：</label>',
    '<div class="form-item-control">',
    '<input name="name" placeholder="请输入名称" />',
    '<span class="form-item-explain">请输入名称</span>',
    '</div>',
    '</div>',
    '<div class="form-item is-required">',
    '<label>描述：</label>',
    '<div class="form-item-control">',
    '<input name="desc" placeholder="请输入描述" />',
    '<span class="form-item-explain">请输入描述</span>',
    '</div>',
    '</div>'
  ].join('');
  function generateTr(list) {
    var strArr = list.map(function (item) {
      item = item || {};
      return [
        '<tr>',
        '<td>',
        '<span class="checkbox"></span>',
        '</td>',
        '<td>' + (item.name || '') + '</td>',
        '<td>' + (item.desc || '') + '</td>',
        '<td>',
        '<button class="btn-link btn-edit">修改</button>',
        '<span class="divider"></span>',
        '<button class="btn-link btn-del">删除</button>',
        '<span class="divider"></span>',
        '<button class="btn-link btn-detail">查看详情</button>',
        '</td>',
        '</tr>'
      ].join('');
    });
    return strArr.join('');
  }
  function TodoList(list) {
    this.list = list;
    this.currItem = undefined;
    this.currList = [];

    this.elWrapper = document.querySelector('.wrapper');

    this.elSearchWrapper = this.elWrapper.querySelector('.search-wrapper');
    this.elSearchName = this.elSearchWrapper.querySelector('.name');
    this.elSearchInputName = this.elSearchName.querySelector('input');
    this.elSearchDesc = this.elSearchWrapper.querySelector('.desc');
    this.elSearchInputDesc = this.elSearchDesc.querySelector('input');
    this.elBtnGroup = this.elSearchWrapper.querySelector('.btn-group');
    this.elBtnReset = this.elBtnGroup.querySelector('.btn-reset');
    this.elBtnQuery = this.elBtnGroup.querySelector('.btn-query');
    this.elBtnExpand = this.elBtnGroup.querySelector('.btn-expand');
    this.elBtnExpand = this.elBtnGroup.querySelector('.btn-expand');

    this.elContent = this.elWrapper.querySelector('.table-content');

    this.elToolbar = this.elContent.querySelector('.table-toolbar');
    this.elBtnAdd = this.elToolbar.querySelector('.btn-add');

    this.elAlert = this.elContent.querySelector('.table-alert');
    this.elAlertNum = this.elAlert.querySelector('.num');
    this.elBtnBatchDel = this.elAlert.querySelector('.btn-batch-del');
    this.elBtnClear = this.elAlert.querySelector('.btn-clear');

    this.elTable = this.elContent.querySelector('table');
    this.elThead = this.elTable.querySelector('thead');
    this.elCheckboxAll = this.elThead.querySelector('tr').querySelector('.checkbox');
    this.elTbody = this.elTable.querySelector('tbody');
    this.elTbody.innerHTML = generateTr(list);

    // form
    this.modal = new Modal({
      children: MODAL_TEMPLATE,
    });

    this.elForms = this.modal.el.querySelectorAll('.form-item');

    this.elFormName = this.elForms[0];
    this.elName = this.elFormName.querySelector('.name');
    this.elExplainName = this.elFormName.querySelector('.form-item-explain');

    this.elFormDesc = this.elForms[1];
    this.elDesc = this.elFormDesc.querySelector('.desc');
    this.elExplainDesc = this.elFormDesc.querySelector('.form-item-explain');

    this.addEvent();
  }
  TodoList.prototype = {
    constructor: TodoList,
    refresh: function (list) {
      list = list || this.list;
      this.currList = [];
      this.elAlert.classList.add('hide');
      this.elCheckboxAll.classList.remove('checked');
      this.elCheckboxAll.classList.remove('indeterminate');
      this.elTbody.innerHTML = generateTr(list);
    },
    getFormNames: function () {
      return [].map.call(this.elForms, (elForm) => {
        return elForm.querySelector('input').name;
      });
    },
    getElInput: function (name) {
      var elInput,
        i = 0;
      while (!elInput && i < this.elForms.length) {
        elInput = this.elForms[i].querySelector('[name=' + name + ']');
        i++;
      }
      return elInput;
    },
    getFieldValue(name) {
      var elInput,
        i = 0,
        value;
      while (!elInput && i < this.elForms.length) {
        elInput = this.elForms[i].querySelector('[name=' + name + ']');
        i++;
      }
      if (!elInput) return undefined;
      value = elInput.value.trim();
      return value;
    },
    getFieldsValue: function (nameList) {
      var _this = this,
        result;
      if (!nameList || !nameList.length) {
        nameList = this.getFormNames();
      }
      if (!Array.isArray(nameList)) {
        nameList = [nameList];
      }
      result = nameList.reduce(function (prev, curr) {
        prev[curr] = _this.getFieldValue(curr);
        return prev;
      }, {});
      return result;
    },
    setFileldValue: function (name, value) {
      var elInput = this.getElInput(name);
      if (!elInput) return false;
      elInput.value = value;
    },
    setFileldsValue: function (obj) {
      var _this = this;
      Object.keys(obj || {}).forEach((key) => {
        _this.setFileldValue(key, obj[key]);
      });
    },
    validateField: function (name) {
      var elInput = this.getElInput(name),
        value,
        elForm;
      if (!elInput) return false;
      value = elInput.value.trim();
      elForm = elInput.parentNode.parentNode;
      if (value && elForm.classList.contains('form-item-has-error')) {
        elForm.classList.remove('form-item-has-error');
      }
      if (!value && !elForm.classList.contains('form-item-has-error')) {
        elForm.classList.add('form-item-has-error');
      }
      return !!value;
    },
    validateFields: function (nameList) {
      var _this = this,
        result = true;
      if (!nameList || !nameList.length) {
        nameList = [].map.call(this.elForms, (elForm) => {
          return elForm.querySelector('input').name;
        });
      }
      if (!Array.isArray(nameList)) {
        nameList = [nameList];
      }
      nameList.forEach(function (name) {
        var _result = _this.validateField(name);
        result && (result = _result);
      });
      if (!result) return false;
      return this.getFieldsValue(nameList);
    },
    resetField: function (name) {
      var elInput = this.getElInput(name),
        elForm;
      if (!elInput) return false;
      elForm = elInput.parentNode.parentNode;
      if (elInput.value) {
        elInput.value = '';
      }
      if (elForm.classList.contains('form-item-has-error')) {
        elForm.classList.remove('form-item-has-error');
      }
    },
    resetFields: function (nameList) {
      var _this = this;
      if (!nameList || !nameList.length) {
        nameList = [].map.call(this.elForms, (elForm) => {
          return elForm.querySelector('input').name;
        });
      }
      if (!Array.isArray(nameList)) {
        nameList = [nameList];
      }
      nameList.forEach((name) => {
        _this.resetField(name);
      });
    },
    addCheckbox: function () {
      this.elTbody.querySelectorAll('tr').forEach((el) => {
        var elCheckbox = el.querySelector('.checkbox');
        if (!elCheckbox.classList.contains('checked')) {
          elCheckbox.classList.add('checked');
        }
      });
      this.currList = this.list.map(function (item) {
        return utils.copy(item);
      });
    },
    removeCheckbox: function () {
      this.elTbody.querySelectorAll('tr').forEach((el) => {
        var elCheckbox = el.querySelector('.checkbox');
        if (elCheckbox.classList.contains('checked')) {
          elCheckbox.classList.remove('checked');
        }
      });
      this.currList = [];
    },
    addTableEvent() {
      var _this = this;
      this.elTbody.querySelectorAll('tr').forEach((el, index) => {
        var currItem = _this.list[index];
        el.querySelector('.checkbox').addEventListener('click', function (e) {
          if (e.target.classList.contains('checked')) {
            e.target.classList.remove('checked');
            _this.currList = _this.currList.filter(function (item) {
              return currItem.id !== item.id;
            });
          } else {
            e.target.classList.add('checked');
            _this.currList.push(utils.copy(currItem));
          }
          if (!_this.currList.length) {
            _this.elAlert.classList.add('hide');
            _this.elCheckboxAll.classList.remove('indeterminate');
          } else {
            _this.elAlert.classList.remove('hide');
            _this.elAlertNum.innerText = _this.currList.length;
            if (_this.currList.length === _this.list.length) {
              _this.elCheckboxAll.classList.remove('indeterminate');
              _this.elCheckboxAll.classList.add('checked');
            } else {
              _this.elCheckboxAll.classList.remove('checked');
              _this.elCheckboxAll.classList.add('indeterminate');
            }
          }
        });
        el.querySelector('.btn-edit').addEventListener('click', function () {
          _this.currItem = utils.copy(currItem);
          _this.modal.setTitie('修改');
          _this.modal.show();
        });
        el.querySelector('.btn-del').addEventListener('click', function () {
          _this.list = _this.list.filter(function (item) {
            return currItem.id !== item.id;
          });
          _this.refresh();
          _this.addTableEvent();
        });
        el.querySelector('.btn-detail').addEventListener('click', function () {
          // 详情未实现
          _this.currItem = utils.copy(currItem);
          _this.modal.setTitie('详情');
          _this.modal.show();
        });
      });
    },
    addEvent: function () {
      var _this = this;
      this.elBtnReset.addEventListener('click', function () {
        _this.elSearchInputName.value = '';
        _this.elSearchInputDesc.value = '';
        _this.list = LIST;
        _this.refresh();
        _this.addTableEvent();
      });
      this.elBtnQuery.addEventListener('click', function () {
        var searchValueName = _this.elSearchInputName.value,
          searchValueDesc = _this.elSearchInputDesc.value;
        _this.list = _this.list.filter((item) => {
          return item.name.indexOf(searchValueName) !== -1 && item.desc.indexOf(searchValueDesc) !== -1;
        });
        _this.refresh();
        _this.addTableEvent();
      });
      this.elBtnExpand.addEventListener('click', function (e) {
        var el = e.target;
        if (el.classList.contains('rotate')) {
          el.classList.remove('rotate');
          _this.elBtnGroup.classList.remove('offset-12');
          _this.elSearchDesc.classList.add('hide');
        } else {
          el.classList.add('rotate');
          _this.elBtnGroup.classList.add('offset-12');
          _this.elSearchDesc.classList.remove('hide');
        }
      });
      this.elBtnBatchDel.addEventListener('click', function () {
        var ids = _this.currList.map(function (item) {
          return item.id;
        });
        _this.list = _this.list.filter(function (item) {
          return ids.indexOf(item.id) === -1;
        });
        _this.refresh();
        _this.addTableEvent();
      });
      this.elBtnClear.addEventListener('click', function () {
        _this.refresh();
        _this.addTableEvent();
      });
      this.elBtnAdd.addEventListener('click', function () {
        _this.currItem = undefined;
        _this.modal.setTitie('新建');
        _this.modal.show();
      });
      this.elForms.forEach((el) => {
        var elInput = el.querySelector('input');
        elInput.addEventListener('input', function () {
          _this.validateField(elInput.name);
        });
      });
      this.elCheckboxAll.addEventListener('click', function (e) {
        if (e.target.classList.contains('checked')) {
          _this.elAlert.classList.add('hide');
          e.target.classList.remove('checked');
          _this.removeCheckbox();
        } else {
          _this.elAlert.classList.remove('hide');
          _this.elAlertNum.innerText = _this.list.length;
          _this.elCheckboxAll.classList.remove('indeterminate');
          e.target.classList.add('checked');
          _this.addCheckbox();
        }
      });
      this.addTableEvent();
      this.modal.open = function () {
        _this.setFileldsValue(_this.currItem);
      };
      this.modal.closed = function () {
        _this.resetFields();
      };
      this.modal.submit = function () {
        var isEdit = _this.currItem,
          currItem,
          result = _this.validateFields();
        if (!result) return;
        if (isEdit) {
          currItem = _this.list.filter(function (item) {
            return item.id === _this.currItem.id;
          })[0];
          Object.keys(currItem).forEach(function (key) {
            currItem[key] = result[key];
          });
        } else {
          result.id = Date.now();
          _this.list.push(result);
        }
        _this.modal.hide();
        _this.refresh();
        _this.addTableEvent();
      };
    },
  };
  new TodoList(LIST);
})();
