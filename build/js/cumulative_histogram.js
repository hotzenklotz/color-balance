(function() {
  define(["./utility"], function(Utility) {
    var CumulativeHistrogram;
    return CumulativeHistrogram = (function() {
      function CumulativeHistrogram(pixelData) {
        this.pixelData = pixelData;
        this.lowerSaturation = 1;
        this.upperSaturation = 2;
        this.createCumulativeHistogram();
      }

      CumulativeHistrogram.prototype.createCumulativeHistogram = function() {
        var blue, green, i, pixelData, red, _i, _j, _ref;
        pixelData = this.pixelData;
        red = new Int32Array(256);
        green = new Int32Array(256);
        blue = new Int32Array(256);
        for (i = _i = 0, _ref = pixelData.length; _i <= _ref; i = _i += 4) {
          red[pixelData[i]]++;
          green[pixelData[i + 1]]++;
          blue[pixelData[i + 2]]++;
        }
        for (i = _j = 1; _j <= 255; i = ++_j) {
          red[i] = red[i] + red[i - 1];
          green[i] = green[i] + green[i - 1];
          blue[i] = blue[i] + blue[i - 1];
        }
        this.red = red;
        this.green = green;
        return this.blue = blue;
      };

      CumulativeHistrogram.prototype.getMaxMin = function() {
        var lengthSingleChannel, maxBlue, maxGreen, maxRed, minBlue, minGreen, minRed, threshold;
        minRed = 0;
        minGreen = 0;
        minBlue = 0;
        lengthSingleChannel = Math.ceil(this.pixelData.length / 4);
        threshold = lengthSingleChannel * this.lowerSaturation / 100;
        while (this.red[minRed + 1] <= threshold) {
          minRed++;
        }
        while (this.green[minGreen + 1] <= threshold) {
          minGreen++;
        }
        while (this.blue[minBlue + 1] <= threshold) {
          minBlue++;
        }
        maxRed = 255 - 1;
        maxGreen = 255 - 1;
        maxBlue = 255 - 1;
        threshold = lengthSingleChannel * (1 - this.upperSaturation / 100);
        while (this.red[maxRed - 1] > threshold) {
          maxRed--;
        }
        while (this.green[maxGreen - 1] > threshold) {
          maxGreen--;
        }
        while (this.blue[maxBlue - 1] > threshold) {
          maxBlue--;
        }
        if (maxRed < 255 - 1) {
          maxRed++;
        }
        if (maxGreen < 255 - 1) {
          maxGreen++;
        }
        if (maxGreen < 255 - 1) {
          maxGreen++;
        }
        this.minRed = minRed;
        this.minGreen = minGreen;
        this.minBlue = minBlue;
        this.maxRed = maxRed;
        this.maxGreen = maxGreen;
        return this.maxBlue = maxBlue;
      };

      CumulativeHistrogram.prototype.getBalancedColors = function() {
        var blue, green, i, maxBlue, maxGreen, maxRed, minBlue, minGreen, minRed, pixelData, red, _i, _ref;
        this.getMaxMin();
        pixelData = this.pixelData, minRed = this.minRed, minGreen = this.minGreen, minBlue = this.minBlue, maxRed = this.maxRed, maxGreen = this.maxGreen, maxBlue = this.maxBlue;
        for (i = _i = 0, _ref = pixelData.length; _i <= _ref; i = _i += 4) {
          red = pixelData[i];
          green = pixelData[i + 1];
          blue = pixelData[i + 2];
          red = Utility.clamp(minRed, maxRed, red);
          green = Utility.clamp(minGreen, maxGreen, green);
          blue = Utility.clamp(minBlue, maxBlue, blue);
          pixelData[i] = (red - minRed) * 255 / (maxRed - minRed);
          pixelData[i + 1] = (green - minGreen) * 255 / (maxGreen - minGreen);
          pixelData[i + 2] = (blue - minBlue) * 255 / (maxBlue - minBlue);
          pixelData[i + 3] = 255;
        }
        return pixelData;
      };

      return CumulativeHistrogram;

    })();
  });

}).call(this);
