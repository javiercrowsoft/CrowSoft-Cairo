(function() {
  "use strict";

  Cairo.Collections = {

    createCollection: function(itemConstructor, parentCollection) {

      if(itemConstructor === undefined) {
        throw new Error("Can't create this collection because the itemConstructor function is undefined");
      }

      var newCollection = function() {
        return {
          items: [],
          keys: {},
          count: 0
        };
      };

      var self = newCollection();

      var that = {};

      //
      // add the element and returns true if the element did NOT already exists
      // in the collection, otherwise returns false.
      //
      that.addIfNotExists = function(value, key) {
        if(that.contains(key)) {
          return false;
        }
        else {
          add(value, key);
          return true;
        }
      };

      that.addBefore = function(index, value, key) {
        return add(value, key, index);
      };

      that.add = function(value, key) {
        return add(value, key);
      };

      var add = function(value, key, index) {

        //
        // if a key is present we need to validate it
        //
        if(key !== undefined) {
          //
          // key is alwas string
          //
          key = key.toString();
          if(self.keys[key] !== undefined) {
            throw new Error("Can't add this item. There is already an object with this key [" + key + "] in the colletion.");
          }
        }
        //
        // update operation
        //
        if(index === undefined || index > self.count) {
          index = self.count;
        }
        //
        // insert operation
        //
        else if(index < self.count){

          var count = self.count;
          //
          // move all elements from index one position to the right
          // to make room for the new element
          //
          for(var i = count; i > index ; i -= 1) {
            self.items[i] = self.items[i-1];
            setIndexInItem(self.items[i], i);
          }
          //
          // update keys array
          //
          var keys = Object.keys(self.keys);
          for(var i = 0; i < keys.length; i += 1) {
            if(self.keys[keys[i]] !== undefined) {
              //
              // update index for every key which references an element
              // moved in this add operation
              //
              if(self.keys[keys[i]] >= index) {
                self.keys[keys[i]] += 1;
              }
            }
          }
        }

        //
        // now that we have made room for the element, if a key is present we need register it
        //
        if(key !== undefined) {
          self.keys[key] = index;
        }

        value = value || itemConstructor(index+1);
        if(key !== undefined && value.setKeyCol !== undefined) {
          value.setKeyCol(key);
        }
        self.items[index] = value;
        setIndexInItem(value, index);
        self.count += 1;

        if(parentCollection !== undefined) {
          parentCollection.add(value, key);
        }

        return value;
      };

      var setIndexInItem = function(value, index) {
        if(value !== undefined && value !== null && itemConstructor !== null) {
          if(value.setIndex !== undefined) {
            value.setIndex(index);
          }
        }
      };

      var checkIndex = function(index, noError) {
        if(noError === undefined) { noError = false; }
        if (typeof index === "number") {
          if (index < 0 || index >= self.count) {
            if(noError) {
              index = -1;
            }
            else {
              throw new Error("Index out of bounds. Index: " + index.toString());
            }
          }
        } else {
          var key = index ? index.toString() : "";
          index = self.keys[key];
          if (index === undefined) {
            if(noError) {
              index = -1;
            }
            else {
              throw new Error("This key is not present in this collection. Key: " + key);
            }
          }
        }
        return index;
      };

      that.contains = function(indexOrKey) {
        return (checkIndex(indexOrKey, true) !== -1);
      };

      that.item = function(indexOrKey) {
        var index = checkIndex(indexOrKey);
        return self.items[index];
      };

      that.getOrElse = function(indexOrKey, elseValue) {
        var index = checkIndex(indexOrKey, true);
        return index !== -1 ? self.items[index] : elseValue;
      };

      that.get = that.item;

      that.remove = function(indexOrKey) {
        var index = checkIndex(indexOrKey);
        var count = self.count;
        var value = null;

        // get a reference to this item to then
        // call to the parent collection remove
        // method
        //
        if(parentCollection !== undefined) {
          value = self.items[index];
        }

        //
        // move all elements from index to the beginning of the array
        //
        for(var i = index; i < count -1; i += 1) {
          self.items[i] = self.items[i + 1];
          setIndexInItem(self.items[i], i);
        }
        //
        // remove the last reference to allow the object be garbage collected
        //
        delete self.items[count -1];
        //
        // update size of items array
        //
        self.count -=1;
        //
        // update keys array
        //
        var keys = Object.keys(self.keys);
        for(var i = 0; i < keys.length; i += 1) {
          if(self.keys[keys[i]] !== undefined) {
            //
            // delete the key for this object
            //
            if(self.keys[keys[i]] === index) {
              delete self.keys[keys[i]];
            }
            //
            // update index for every key which references an element
            // moved in this remove operation
            //
            else if(self.keys[keys[i]] > index) {
              self.keys[keys[i]] -= 1;
            }
          }
        }
        if(parentCollection !== undefined) {
          parentCollection.remove(value);
        }
      };

      that.removeObject = function(object) {
        var count = self.items.length;
        for(var i = 0; i < count; i += 1) {
          if(self.items[i] === object) {
            that.remove(i);
            break;
          }
        }
      };

      var clearParentCollection = function() {
        if(parentCollection !== undefined) {
          var count = self.items.length;
          for(var i = 0; i < count; i += 1) {
            parentCollection.removeObject(self.items[i]);
          }
        }
      };

      that.clear = function() {
        clearParentCollection();
        self = newCollection();
      };

      that.count = function() {
        return self.count;
      };

      that.size = that.count;

      that.each = function(f) {
        var args = Array.prototype.slice.call(arguments, 1);

        for(var i = 0, count = self.items.length; i < count; i += 1) {
          if(f.apply(null, [self.items[i], i].concat(args)) === false) {
            return false;
          }
        }
        return true;
      };

      that.map = function(f) {
        var args = Array.prototype.slice.call(arguments, 1);
        var r = [];

        for(var i = 0, count = self.items.length; i < count; i += 1) {
          r.push(f.apply(null, [self.items[i], i].concat(args)));
        }

        return r;
      };

      that.selectFirst = function(f) {
        var args = Array.prototype.slice.call(arguments, 1);

        for(var i = 0, count = self.items.length; i < count; i += 1) {
          var item = self.items[i];
          if(f.apply(null, [item, i].concat(args))) {
            return item;
          }
        }

        return null;
      };

      that.select = function(f) {
        var args = Array.prototype.slice.call(arguments, 1);
        var selected = Cairo.Collections.createCollection(null);
        for(var i = 0, count = self.items.length; i < count; i += 1) {
          var item = self.items[i];
          if(f.apply(null, [item, i].concat(args))) {
            selected.add(item);
          }
        }

        return selected;
      };

      that.inspect = function(f) {
        var printToLog = function(item, i) {
          try {
            Cairo.log("item " + i.toString()
              + ": " + item.toString()
              + " - Name: " + (item.getName ? item.getName() : "")
              + " - Text: " + (item.getText ? item.getText() : "")
              + " - f: " + (f ? item[f].apply(item) : "")
            );
          }
          catch(ignore) {}
          return true;
        };
        that.each(printToLog);
      };

      that.filter = function(f) {
        var coll = Cairo.Collections.createCollection(null);
        that.each(function(e) { if(f(e)) coll.add(e); });
        return coll;
      };

      that.join = function(separator) {
        var str = "";
        that.each(function(e) { str += e + separator; });
        return str.slice(0,-1);
      };

      return that;
    },

    getKey: function(text) {
      return "k" + text.toString();
    }

  };

}());

