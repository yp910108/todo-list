var Modal = (function () {
  function generModal(title, children) {
    var elWrapper = document.createElement('div'),
      elBody;
    elWrapper.className = 'modal-wrapper hide';
    elWrapper.innerHTML = [
      '<div class="modal-mask"></div>',
      '<div class="modal-box">',
      '<div class="modal-header">',
      '<span class="modal-title">' + title + '</span>',
      '<span class="modal-close"></span>',
      '</div>',
      '<div class="modal-body">',
      '</div>',
      '<div class="modal-footer">',
      '<button class="cancel">取消</button>',
      '<button class="btn-primary submit">提交</button>',
      '</div>',
      '</div>',
    ].join('');
    elBody = elWrapper.querySelector('.modal-body');
    if (children) {
      if (children instanceof Array) {
        [].forEach.call(children, function (child) {
          elBody.appendChild(child);
        });
      } else {
        elBody.innerHTML = children;
      }
    }
    return elWrapper;
  }
  function Modal(options) {
    options = options || {};
    this.el = generModal(options.title || '标题', options.children);
    options.open && (this.open = options.open);
    options.closed && (this.closed = options.closed);
    options.submit && (this.submit = options.submit);
    this.elMask = this.el.querySelector('.modal-mask');
    this.elBox = this.el.querySelector('.modal-box');
    this.elClose = this.elBox.querySelector('.modal-close');
    this.elBtnCancel = this.elBox.querySelector('.cancel');
    this.elBtnSubmit = this.elBox.querySelector('.submit');
    document.body.appendChild(this.el);
    this.init();
  }
  Modal.prototype = {
    constructor: Modal,
    init: function () {
      this.addEventListener();
    },
    addEventListener: function () {
      var hide = this.hide.bind(this);
      this.elMask.addEventListener('click', hide);
      this.elClose.addEventListener('click', hide);
      this.elBtnCancel.addEventListener('click', hide);
      this.elBtnSubmit.addEventListener('click', this.submit.bind(this));
    },
    show: function () {
      var _this = this;
      this.el.classList.remove('hide');
      this.el.classList.add('show');
      typeof _this.open === 'function' && _this.open();
      setTimeout(function () {
        typeof _this.opened === 'function' && _this.opened();
      }, 500);
    },
    hide: function () {
      var _this = this;
      this.el.classList.remove('show');
      this.el.classList.add('hiding');
      setTimeout(function () {
        _this.el.classList.remove('hiding');
        _this.el.classList.add('hide');
        typeof _this.closed === 'function' && _this.closed();
      }, 500);
    },
    submit: function () {
      const result = typeof this.submit === 'function' && this.submit();
      if (result) {
        this.hide();
      }
    },
  };
  return Modal;
})();
