angular.module("starter").factory('DataService', function ($http) {
	var url = "json/data.json";
        return {
            findAll: function () {
                return $http.get(url).then(function (response) {
                    return response.data;
                });
            },
            findByDates: function (fromDate, toDate) {

                var formatDate =  function (dateToFormat) {
                    if (dateToFormat !== undefined && !angular.isString(dateToFormat)) {
                        return dateToFormat.getYear() + '-' + dateToFormat.getMonth() + '-' + dateToFormat.getDay();
                    }
                    return dateToFormat;
                };

                return $http.get('api/audits/byDates', {params: {fromDate: formatDate(fromDate), toDate: formatDate(toDate)}}).then(function (response) {
                    return response.data;
                });
            }
        };
    });