/*!
 * https://github.com/ulybu/timezones
 * Fork, adding few extra features. Hopefully I'll get time to submit a proper pull request that will be accepted
 *
 * FORKED FROM:
 * timezones - A jQuery plugin to turn a select box into a timezone selector
 * v0.1.0
 * https://github.com/firstandthird/timezones
 * copyright First+Third 2014
 * MIT License
*/
(function($){

  var Timezone = {
    init : function(cities, formatName, sortingFn){
      this.cities = [];
      this.formatName = formatName;

      for(var key in cities) {
        this.cities.push({
          name: cities[key],
          offset: moment.tz(cities[key]).format('Z')
        });
      }

      this.cities.sort(sortingFn);

      this.html = this.getHTMLOptions();
      this.currentTimezone = this.guessTimezone();
    },
    getHTMLOptions : function(){
      var html = '';
      var offset = 0;
      var i, c = this.cities.length, city;

      for(i = 0; i < c; i++) {
        city = this.cities[i];
        html += '<option data-offset="' + city.offset + '" value="'+ city.name +'">(GMT ' + city.offset + ') ' + this.formatName(city.name) +'</option>';
      }

      return html;
    },
    addNames : function(select){
      return $(select).empty().append($(this.html));
    },
    selectValue : function(select, value){
      value = value || this.currentTimezone;

      var match = $(select).find('option[value="' + value + '"]');

      if (match.length){
        $(select).val(match.val());
      }

      return $(select);
    },
    guessTimezone : function(){
      return moment.tz.guess();
    },
    getCurrentOffset : function(){
      return parseInt(this.currentTimezone, 10);
    }
  };

  $.fn.timezones = function(opts) {

    if(typeof opts === "string") {
      return Timezone[opts].apply(Timezone, Array.prototype.slice.call(arguments));
    }

    opts = $.extend({}, $.fn.timezones.defaults, opts);
    if (opts.tz.zones.length !== 0) {
      moment.tz.load(opts.tz);
    }

    if(!opts.formatName || typeof opts.formatName !== 'function') {
      opts.formatName = function(str) {
        return str;
      };
    }

    if(!opts.sortingFn || typeof opts.sortingFn !== 'function') {
      opts.sortingFn = function(a, b){
        return parseInt(a.offset.replace(":", ""), 10) - parseInt(b.offset.replace(":", ""), 10);
      }
    }

    Timezone.init(moment.tz.names(), opts.formatName, opts.sortingFn);

    return this.each(function(){
      Timezone.addNames(this);
      Timezone.selectValue(this);
      return this;
    });
  };

  $.fn.timezones.defaults = {
    tz: {
      zones: []
    }
  };
})(jQuery);
