(function(window, document){
  var _ = {
    extend: function(target){
      var args = _.slice(arguments, 1), i = args.length, obj, key;
      while(i--){
        obj = args[i];
        for(key in obj){
          target[key] = obj[key];
        }
      }
      return target;
    },
    slice: function(array, n){
      return Array.prototype.slice.call(array, n || 0);
    }
  };

  function addEvent(obj, evType, fn, useCapture){
    if(obj.addEventListener){
      obj.addEventListener(evType, fn, useCapture);
      return true;
    }
    else if(obj.attachEvent){
      var r = obj.attachEvent("on" + evType, fn);
      return r;
    }
  }

  function removeEvent(elem, eventType,handler) {
    if(elem.removeEventListener){
      elem.removeEventListener(eventType, handler, false);
    }
    else if(elem.detachEvent){
      elem.detachEvent('on' + eventType, handler);
    }
  }

  function nonEmpty(){
    var args = _.slice(arguments), ret = [];
    for(var i = 0, ilen = args.length; i < ilen; i++){
      args[i] && ret.push(args[i]);
    }
    return ret;
  }

  var body = document.getElementsByTagName('body')[0];

  function Modal(config){

    // Set defaults and import user config
    _.extend(this, {
      "name": "",
      "left": "0px",
      "top" : "0px"
    }, config);

    // Create the modal and set attributes
    var modal = this.modal = document.createElement('div');

    modal.className = nonEmpty(modal.className, 'modal', this.name).join(' ');

    // Set the required styles
    var style = modal.style;
    style.position = "absolute";
    style.left     = this.left;
    style.top      = this.top;

    // Initialize vars to persist state
    var offset_x; // relative to pointer
    var offset_y; // relative to pointer
    var target;

    function moveEle(e){
      // crossbrowser support for IE
      var e = e || window.event;

      // update position relative to mouse pointer
      var style = target.style;
      style.left = e.pageX - offset_x;
      style.top  = e.pageY - offset_y;
    }

    addEvent(modal, 'mousedown', function(e){
      // crossbrowser support for IE
      var e = e || window.event;

      // assign the element as our target for the
      // movement routine
      target = e.srcElement;

      // prevent text selection during drag
      body.style[prefix('userSelect')] = "none";

      // find position of element and cal offset
      // from the mouse pointer
      var pos = target.getBoundingClientRect();
      offset_x = e.pageX - pos.left;
      offset_y = e.pageY - pos.top;

      addEvent(body, 'mousemove', moveEle);
    });

    addEvent(modal, 'mouseup', function(e){
      // re-enable text selection
      body.style[prefix('userSelect')] = "";

      removeEvent(body, 'mousemove', moveEle);
    });

    this.hide();

    body.appendChild(modal);

    return this;
  }

  Modal.fn = Modal.prototype = {
    show: function(){
      this.modal.style.display = "block";
      return this;
    },

    hide: function(){
      this.modal.style.display = "none";
      return this;
    },

    destroy: function(){
      this.modal.remove();
    },

    insert: function(html){
      this.modal.innerHTML = html;
      return this;
    }
  };

  window.Modal = Modal;
})(window, document);

(function(window){

  var styles = window.getComputedStyle(document.documentElement, '')
    , pre = (Array.prototype.slice
        .call(styles)
        .join('')
        .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
      )[1]
    , dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1]
    , capitalize = function(str){ return str.charAt(0).toUpperCase() + str.substring(1) }
  ;//var

  if(pre)
    window.prefix = function(prop){ return pre + capitalize(prop) }
  else
    window.prefix = function(prop){ return prop }

  window.prefix.dom = dom;
  window.prefix.lowercase = pre;
  window.prefix.css = '-' + pre + '-';
  window.prefix.js = capitalize(pre);

})(window);

// (function(window, document){




// function Modal(config){

//   _.extend(this, config);

// }

// Modal.fn = Modal.prototype = {






// }


// })(window, document)