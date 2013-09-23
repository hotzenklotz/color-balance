(function() {
  define(["./utility"], function(Utility) {
    var Histogram;
    return Histogram = (function() {
      function Histogram(pixelData) {
        this.pixelData = pixelData;
        this.getMax = Utility.memoize((function() {
          return this._getMaxMin(Math.max);
        }), "getMax");
        this.getMin = Utility.memoize((function() {
          return this._getMaxMin(Math.max);
        }), "getMin");
        this.createHistogram();
      }

      Histogram.prototype.createHistogram = function() {
        var b, blue, g, green, i, pixelData, r, red, _i, _ref;
        red = new Int32Array(256);
        green = new Int32Array(256);
        blue = new Int32Array(256);
        pixelData = this.pixelData;
        for (i = _i = 0, _ref = pixelData.length; _i <= _ref; i = _i += 4) {
          r = pixelData[i];
          g = pixelData[i + 1];
          b = pixelData[i + 2];
          red[r]++;
          green[g]++;
          blue[b]++;
        }
        this.red = red;
        this.green = green;
        return this.blue = blue;
      };

      Histogram.prototype._getMaxMin = function(operation) {
        var blue, green, i, red, result, _i;
        red = 0;
        green = 0;
        blue = 0;
        for (i = _i = 0; _i <= 255; i = ++_i) {
          red = operation(red, this.red[i]);
          green = operation(green, this.green[i]);
          blue = operation(blue, this.blue[i]);
        }
        return result = {
          "red": red,
          "green": green,
          "blue": blue,
          "overall": operation(red, operation(green, blue))
        };
      };

      Histogram.prototype.draw = function(element) {
        this.element = element;
        this.ctx = this.element.getContext("2d");
        this.width = this.element.width;
        this.height = this.element.height;
        this.ctx.fillStyle = "rgba(255, 255, 255, 255)";
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fill();
        this._draw(this.red, "rgba(255, 0, 0, 1)");
        this._draw(this.green, "rgba(0, 255, 0, 1)");
        return this._draw(this.blue, "rgba(0, 0, 255, 1)");
      };

      Histogram.prototype._draw = function(data, color) {
        var heightScale, i, widthScale, x, y, _i;
        heightScale = this.height / this.getMax().overall;
        widthScale = this.width / 256;
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        for (i = _i = 0; _i <= 255; i = ++_i) {
          x = i * widthScale;
          y = this.height - heightScale * data[i];
          this.ctx.lineTo(x, y);
        }
        return this.ctx.stroke();
      };

      Histogram.prototype.getHistograms = function() {
        var result;
        return result = {
          "red": this.red,
          "green": this.green,
          "blue": this.blue
        };
      };

      return Histogram;

    })();
  });

}).call(this);
