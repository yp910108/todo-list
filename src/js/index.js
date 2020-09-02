(function () {
  var LIST = [
    { id: 1, name: '测试名称1', desc: '测试描述1' },
    { id: 2, name: '测试名称2', desc: '测试描述2' },
    { id: 3, name: '测试名称3', desc: '测试描述3' },
    { id: 4, name: '测试名称4', desc: '测试描述4' },
    { id: 5, name: '测试名称5', desc: '测试描述5' },
  ];
  var MODALCONTENT = [
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
    '</div>',
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
        '<button class="btn-link btn-detail">查看详情</button>',
        '</td>',
        '</tr>',
      ].join('');
    });
    return strArr.join('');
  }
  function TodoList(list) {
    this.list = list;
    this.currItem = undefined;

    this.elWrapper = document.querySelector('.wrapper');

    this.elContent = this.elWrapper.querySelector('.table-content');
    this.elBtnAdd = this.elContent.querySelector('.btn-add');

    this.elTable = this.elContent.querySelector('table');
    this.elTbody = this.elTable.querySelector('tbody');
    this.elTbody.innerHTML = generateTr(list);

    // form
    this.modal = new Modal({
      title: '新建',
      children: MODALCONTENT,
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
      Object.keys(obj).forEach((key) => {
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
    addTableEvent() {
      var _this = this;
      this.elTbody.querySelectorAll('tr').forEach((el, index) => {
        el.querySelector('.btn-edit').addEventListener('click', function () {
          var currItem = _this.list[index];
          _this.currItem = Object.keys(currItem).reduce(function (prev, curr) {
            prev[curr] = currItem[curr];
            return prev;
          }, {});
          _this.modal.show();
        });
      });
    },
    addEvent: function () {
      var _this = this;
      this.elBtnAdd.addEventListener('click', function () {
        _this.currItem = undefined;
        _this.modal.show();
      });
      this.elForms.forEach((el) => {
        var elInput = el.querySelector('input');
        elInput.addEventListener('input', function () {
          _this.validateField(elInput.name);
        });
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
