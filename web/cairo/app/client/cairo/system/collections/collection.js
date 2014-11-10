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

      that.add = function(value, key) {
        //
        // if a key is present we need to validate it
        //
        if (key !== undefined) {
          //
          // key is alwas string
          //
          key = key.toString();
          if (self.keys[key] !== undefined) {
            throw new Error("Can't add this item. There is already an object with this key [" + key + "] in the colletion.");
          }
          self.keys[key] = self.count;
        }
        value = value || itemConstructor();
        if(key !== undefined && value.setKeyCol !== undefined) {
          value.setKeyCol(key);
        }
        self.items[self.count] = value;
        setIndexInItem(value, self.count);
        self.count += 1;

        if(parentCollection !== undefined) {
          parentCollection.add(value);
        }

        return value;
      };

      var setIndexInItem = function(value, index) {
        if(value !== undefined && value != null && itemConstructor !== null) {
          if(value.setIndex !== undefined) {
            value.setIndex(index);
          }
        }
      };

      var checkIndex = function(index) {
        if (typeof index === "number") {
          if (index < 0 || index >= self.count) {
            throw new Error("Index out of bounds. Index: " + index.toString());
          }
        } else {
          var key = index.toString();
          index = self.keys[key];
          if (index === undefined) {
            throw new Error("This key is not present in this collection. Key: " + key);
          }
        }
        return index;
      };

      that.item = function(indexOrKey) {
        var index = checkIndex(indexOrKey);
        return self.items[index];
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
        delete self.items[self.count-1];
        //
        // update size of items array
        //
        self.count -=1;
        //
        // update keys array
        //
        var keys = Object.keys(self.keys);
        for(var i = 0; i < keys.length; i += 1) {
          if(self.keys[keys[i]]) {
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

      return that;
    }
  };

}());

