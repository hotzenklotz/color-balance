define ["./utility"], (Utility) ->
  class Histogram

    constructor : (@pixelData) ->

      @getMax = Utility.memoize((-> @_getMaxMin(Math.max)), "getMax")
      @getMin = Utility.memoize((-> @_getMaxMin(Math.max)), "getMin")

      @createHistogram()


    createHistogram : ->

      red = new Int32Array(256)
      green = new Int32Array(256)
      blue = new Int32Array(256)
      pixelData = @pixelData

      for i in [0..pixelData.length] by 4
        r = pixelData[i]
        g = pixelData[i + 1]
        b = pixelData[i + 2]
        #a = pixelData[i + 3]

        red[r]++
        green[g]++
        blue[b]++

      @red = red
      @green = green
      @blue = blue


    _getMaxMin : (operation) ->

      red = 0
      green = 0
      blue = 0

      for i in [0..255]
        red = operation(red, @red[i])
        green = operation(green, @green[i])
        blue = operation(blue, @blue[i])

      return result =
        "red": red
        "green": green
        "blue": blue
        "overall": operation(red, Math.max(green, blue))


    draw : (@element) ->

      @ctx = @element.getContext("2d")
      @width = @element.width
      @height = @element.height

      #background
      @ctx.fillStyle = "rgba(255, 255, 255, 255)"
      @ctx.fillRect(0, 0, @width, @height)
      @ctx.fill()

      @_draw(@red, "rgba(255, 0, 0, 1)")
      @_draw(@green, "rgba(0, 255, 0, 1)")
      @_draw(@blue, "rgba(0, 0, 255, 1)")


    _draw : (data, color) ->

      heightScale = @height / @getMax().overall
      widthScale = @width / 256

      @ctx.strokeStyle = color
      @ctx.beginPath()
      @ctx.moveTo(0, 0)

      for i in [0..255]

        x = i * widthScale
        y = @height - heightScale * data[i]
        @ctx.lineTo(x, y)

      @ctx.stroke()


    getHistograms : ->

      result =
        "red": @red
        "green": @green
        "blue": @blue


