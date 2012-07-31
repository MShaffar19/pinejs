(function() {
  var __hasProp = Object.prototype.hasOwnProperty;

  require(['utils/createAsyncQueueCallback'], function(createAsyncQueueCallback) {
    var runTrans;
    runTrans = function(rootElement) {
      var lockResource, obj;
      if ($(".action").size() > 0) {
        obj = [
          {
            value: 'trans'
          }
        ];
        serverRequest('POST', '/transaction/transaction', {}, obj, function(statusCode, result, headers) {
          return serverRequest("GET", headers.location, {}, null, function(statusCode, trans, headers) {
            var callback, data, lockCount;
            lockCount = 0;
            data = [];
            callback = function(op, lockID, fields) {
              var asyncCallback, cr_uri, dataElement, key, pair, sendData, value, _fn, _i, _j, _len, _len2, _ref;
              if (fields == null) fields = {};
              data.push([op, lockID, fields]);
              if (data.length === lockCount) {
                cr_uri = "/transaction/conditional_representation";
                asyncCallback = createAsyncQueueCallback(function() {
                  return serverRequest("POST", trans.ctURI, {}, null, function(statusCode, result, headers) {
                    return location.hash = "#!/data/";
                  });
                });
                for (_i = 0, _len = data.length; _i < _len; _i++) {
                  dataElement = data[_i];
                  switch (dataElement[0]) {
                    case "del":
                      asyncCallback.addWork(1);
                      sendData = [
                        {
                          lock: dataElement[1],
                          field_name: '__DELETE',
                          field_type: '',
                          field_value: ''
                        }
                      ];
                      (function(sendData) {
                        return serverRequest("DELETE", cr_uri + '*filt:lock=' + sendData[0].lock, {}, null, function() {
                          return serverRequest("PUT", cr_uri, {}, sendData, asyncCallback.successCallback);
                        });
                      })(sendData);
                      break;
                    case "edit":
                      _ref = dataElement[2];
                      for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
                        pair = _ref[_j];
                        _fn = function(sendData) {
                          return serverRequest("DELETE", cr_uri + '*filt:lock=' + sendData[0].lock, {}, null, function() {
                            return serverRequest("PUT", cr_uri, {}, sendData, asyncCallback.successCallback);
                          });
                        };
                        for (key in pair) {
                          if (!__hasProp.call(pair, key)) continue;
                          value = pair[key];
                          sendData = [
                            {
                              lock: dataElement[1],
                              field_name: key,
                              field_type: typeof value,
                              field_value: value
                            }
                          ];
                          asyncCallback.addWork(1);
                          _fn(sendData);
                        }
                      }
                  }
                }
                return asyncCallback.endAdding();
              }
            };
            $(".action").each(function(index) {
              var _ref;
              if ((_ref = $(this).children("#__actype").val()) === "editterm" || _ref === "editfctp" || _ref === "del") {
                return lockCount++;
              }
            });
            return $(".action").each(function(index) {
              var resourceID, resourceType;
              resourceID = $(this).children("#__id").val();
              resourceType = $(this).children("#__type").val();
              switch ($(this).children("#__actype").val()) {
                case "editfctp":
                case "editterm":
                  return lockResource(resourceType, resourceID, trans, function(lockID) {
                    var inputs, o;
                    inputs = $(":input:not(:submit)", rootElement);
                    o = $.map(inputs, function(n, i) {
                      var ob;
                      if (n.id.slice(0, 2) !== "__") {
                        ob = {};
                        ob[n.id] = $(n).val();
                        return ob;
                      }
                    });
                    return callback("edit", lockID, o);
                  });
                case "del":
                  return lockResource(resourceType, resourceID, trans, function(lockID) {
                    return callback("del", lockID);
                  });
                case "addterm":
                case "addfctp":
                  break;
              }
            });
          });
        });
      }
      return lockResource = function(resource_type, resource_id, trans, successCallback, failureCallback) {
        return serverRequest("POST", trans.lcURI, {}, [
          {
            value: "lok"
          }
        ], (function(statusCode, result, headers) {
          return serverRequest("GET", headers.location, {}, null, (function(statusCode, lock, headers) {
            var lockID, o;
            lockID = lock.instances[0].id;
            o = [
              {
                transaction: trans.id,
                lock: lockID
              }
            ];
            return serverRequest("POST", trans.tlcURI, {}, o, (function(statusCode, result, headers) {
              o = [
                {
                  id: lockID
                }
              ];
              return serverRequest("POST", trans.xlcURI, {}, o, (function(statusCode, result, headers) {
                o = [
                  {
                    resource_id: parseInt(resource_id, 10)
                  }
                ];
                return serverRequest("POST", trans.rcURI, {}, o, (function(statusCode, result, headers) {
                  return serverRequest("GET", headers.location, {}, null, (function(statusCode, resource, headers) {
                    o = [
                      {
                        resource: resource.instances[0].id,
                        resource_type: resource_type,
                        lock: lockID
                      }
                    ];
                    return serverRequest("POST", trans.lrcURI, {}, o, (function(statusCode, result, headers) {
                      return successCallback(lockID);
                    }), failureCallback);
                  }), failureCallback);
                }), failureCallback);
              }), failureCallback);
            }), failureCallback);
          }), failureCallback);
        }), failureCallback);
      };
    };
    return typeof window !== "undefined" && window !== null ? window.runTrans = runTrans : void 0;
  });

}).call(this);
