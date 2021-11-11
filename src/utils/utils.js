const UTILS = {
    queryStringParse: function(string) {
      let parsed = {};
      if (string !== "") {
        string = string.substring(string.indexOf("?") + 1);
        let p1 = string.split("&");
        p1.map(function(value) {
          let params = value.split("=");
          parsed[params[0]] = params[1];
        });
      }
      return parsed;
    }
  };
  
  export default UTILS;