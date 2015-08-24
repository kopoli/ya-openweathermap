'use strict'

angular.module('ya-openweathermap', [])
    .directive('yaOpenweathermap',['$http','$filter',function ($http,$filter) {
	return {
	    restrict: 'EA',
	    templateUrl: 'ya-openweathermap.html',

	    link: function(scope,element,attrs) {
		var baseURL = 'http://api.openweathermap.org/data/2.5/';
		var APIKey = '';
		if(attrs.apiKey) {
		    APIKey = '&APPID='+attrs.apiKey
		}
		var currentURL = baseURL + 'weather?units=metric&q=' + attrs.cityName + APIKey;
		var forecastURL = baseURL + 'forecast/daily?units=metric&cnt=5&q=' + attrs.cityName + APIKey;

		function datestr(dateint, fmt) {
		    return $filter('date')(dateint, fmt)
		};

		function parseWeather(weather, half, datefmt) {
		    return {
			Temp: weather.main.temp,
			Pressure: weather.main.pressure,
			Humidity: weather.main.humidity,
			TempMin: weather.main.temp_min,
			TempMax: weather.main.temp_max,
			WindSpeed: weather.wind.speed,
			WindDeg: 'wi-wind towards-'+weather.wind.deg.toString()+'-deg',
			Time: datestr(weather.dt * 1000, datefmt),
			TimeInt: weather.dt,
			Sunrise: datestr(weather.sys.sunrise * 1000, datefmt),
			Sunset: datestr(weather.sys.sunset * 1000, datefmt),
			Icon: 'wi-owm-'+half+'-' + weather.weather[0].id.toString(),
			Desc: weather.weather[0].description,
		    };
		}

		function parseDailyWeather(weather, datefmt) {
		    return {
			Temp: weather.temp.day,
			MornTemp: weather.temp.morn,
			EveTemp: weather.temp.eve,
			NightTemp: weather.temp.night,
			Pressure: weather.pressure,
			Humidity: weather.humidity,
			Time: datestr(weather.dt * 1000, datefmt),
			TimeInt: weather.dt,
			Icon: 'wi-owm-' + weather.weather[0].id.toString(),
			Desc: weather.weather[0].description,
			WindSpeed: weather.speed,
			WindDeg: 'wi-wind towards-'+weather.deg.toString()+'-deg',
		    };
		}

		$http.get(currentURL).success(function(ret) {
		    var half = 'day';
		    if(ret.sys.sunrise > ret.dt || ret.sys.sunset <= ret.dt)
			half = 'night';

		    scope.cur = parseWeather(ret, half, 'yyyy-MM-dd HH:mm:ss');
		    scope.cur.Name = ret.name;
		});

		$http.get(forecastURL).success(function(ret) {
		    scope.forecast = [];

		    for (var i in ret.list) {
			scope.forecast.push(parseDailyWeather(ret.list[i], 'EEE dd.M HH:mm'))
		    }
		});
	    },
	}
    }]);
