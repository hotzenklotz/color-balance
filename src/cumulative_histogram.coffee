define ["./utility"], (Utility) ->

  class CumulativeHistrogram

    constructor : (@pixelData) ->

      @lowerSaturation = 1
      @upperSaturation = 2

      @createCumulativeHistogram()


    createCumulativeHistogram : ->

      pixelData = @pixelData
      red = new Int32Array(256)
      green = new Int32Array(256)
      blue = new Int32Array(256)

      for i in [0..pixelData.length] by 4
        red[pixelData[i]]++
        green[pixelData[i + 1]]++
        blue[pixelData[i + 2]]++
        #a = pixelData[i + 3]

      for i in [1..255]
        red[i] = red[i] + red[i - 1]
        green[i] = green[i] + green[i - 1]
        blue[i] = blue[i] + blue[i - 1]

      @red = red
      @green = green
      @blue = blue


    getMaxMin : ->

      minRed = 0
      minGreen = 0
      minBlue = 0
      lengthSingleChannel = Math.ceil(@pixelData.length / 4)
      threshold = lengthSingleChannel * @lowerSaturation / 100

      while @red[minRed + 1] <= threshold
        minRed++
      while @green[minGreen + 1] <= threshold
        minGreen++
      while @blue[minBlue + 1] <= threshold
        minBlue++

      maxRed = 255 - 1
      maxGreen = 255 - 1
      maxBlue = 255 - 1
      threshold = lengthSingleChannel * (1 - @upperSaturation / 100)

      while @red[maxRed - 1] > threshold
        maxRed--
      while @green[maxGreen - 1] > threshold
        maxGreen--
      while @blue[maxBlue - 1] > threshold
        maxBlue--

      if maxRed < 255 - 1
          maxRed++
      if maxGreen < 255 - 1
          maxGreen++
      if maxGreen < 255 - 1
          maxGreen++

      @minRed = minRed
      @minGreen = minGreen
      @minBlue = minBlue
      @maxRed = maxRed
      @maxGreen = maxGreen
      @maxBlue = maxBlue


    getBalancedColors : ->
      # implementation for the "simplest color balance" algorithm as outlined
      # in http://www.ipol.im/pub/art/2011/llmps-scb/ and
      # http://scien.stanford.edu/pages/labsite/2010/psych221/projects/2010/JasonSu/simplestcb.html
      #
      # This method can be replaced by a shader.

      @getMaxMin()
      {pixelData, minRed, minGreen, minBlue, maxRed, maxGreen, maxBlue } = @

      for i in [0..pixelData.length] by 4

        red   = pixelData[i]
        green = pixelData[i + 1]
        blue  = pixelData[i + 2]

        red = Utility.clamp(minRed, maxRed, red)
        green = Utility.clamp(minGreen, maxGreen, green)
        blue = Utility.clamp(minBlue, maxBlue, blue)

        # rescale
        pixelData[i] = (red - minRed) * 255 / (maxRed - minRed)
        pixelData[i + 1] = (green - minGreen) * 255 / (maxGreen - minGreen)
        pixelData[i + 2] = (blue - minBlue) * 255 / (maxBlue - minBlue)
        pixelData[i + 3] = 255

      pixelData
