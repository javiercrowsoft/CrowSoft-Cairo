(function() {
  "use strict";

  Cairo.ProductoSerieType = {

    createObject: function() {

      var self = {};

      var m_prnsId = 0;
      var m_prId = 0;
      var m_code = "";
      var m_code2 = "";
      var m_code3 = "";
      var m_descrip = "";
      var m_fechaVto = null;
      var m_prIdItem = 0;
      var m_kitItem = "";
      var m_prIdKit = 0;
      var m_idGroup = 0;

      // it is flag used to know if this serial number must be deleted from the database because
      // the amount in purchase order/purchase invoice has changed
      //
      var m_deleted;

      self.getPrnsId = function() {
        return m_prnsId;
      };

      self.setPrnsId = function(rhs) {
        m_prnsId = rhs;
      };

      self.getCode = function() {
        return m_code;
      };

      self.setCode = function(rhs) {
        m_code = rhs;
      };

      self.getCode2 = function() {
        return m_code2;
      };

      self.setCode2 = function(rhs) {
        m_code2 = rhs;
      };

      self.getCode3 = function() {
        return m_code3;
      };

      self.setCode3 = function(rhs) {
        m_code3 = rhs;
      };

      self.getDescrip = function() {
        return m_descrip;
      };

      self.setDescrip = function(rhs) {
        m_descrip = rhs;
      };

      self.getFechaVto = function() {
        return m_fechaVto;
      };

      self.setFechaVto = function(rhs) {
        m_fechaVto = rhs;
      };

      self.getPrId = function() {
        return m_prId;
      };

      self.setPrId = function(rhs) {
        m_prId = rhs;
      };

      self.getPrIdItem = function() {
        return m_prIdItem;
      };

      self.setPrIdItem = function(rhs) {
        m_prIdItem = rhs;
      };

      self.getKitItem = function() {
        return m_kitItem;
      };

      self.setKitItem = function(rhs) {
        m_kitItem = rhs;
      };

      self.getIdGroup = function() {
        return m_idGroup;
      };

      self.setIdGroup = function(rhs) {
        m_idGroup = rhs;
      };

      self.getPrIdKit = function() {
        return m_prIdKit;
      };

      self.setPrIdKit = function(rhs) {
        m_prIdKit = rhs;
      };

      self.getDeleted = function() {
        return m_deleted;
      };

      self.setDeleted = function(rhs) {
        m_deleted = rhs;
      };

      return self;
    }
  };

}());
