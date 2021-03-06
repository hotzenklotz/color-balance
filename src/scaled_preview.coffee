require ["./build/js/histogram", "./build/js/job_queue", "./build/js/bower_components/promise/promise"], (Histogram, JobQueue, Promise) ->


  processImage = (imageSrc, width) ->

    promise = new window.Promise()

    image = new Image()
    image.src = imageSrc
    image.addEventListener "load", ->

      aspectRatio = image.width / image.height
      height = width / aspectRatio


      elements = appendImageAndCanvasGroup(image.width, image.height, width + " x " + height)

      originalImage = elements.originalImage
      originalImage.width = width
      originalImage.height = height
      ctx = originalImage.getContext("2d")
      ctx.drawImage(image, 0, 0, width, height)
      preview_pixelData = ctx.getImageData(0, 0, width, height).data

      #draw the RGB histogram for visual reference
      histogram = new Histogram(preview_pixelData)
      histogram.draw(elements.originalHistogram)

      canvas = elements.modifiedImage
      canvas.width = width
      canvas.height = height

      ctx = canvas.getContext("2d")
      ctx.drawImage(image, 0, 0, width, height)
      imageData = ctx.getImageData(0, 0, width, height)
      pixelData = imageData.data

      ColorBalanceWorker = new Worker("./build/js/color_balance_worker.js")
      ColorBalanceWorker.addEventListener "message", (evt) =>
        modifiedPixels = evt.data

        #Draw the modified histogram too
        modifiedHistogram = new Histogram(modifiedPixels)
        modifiedHistogram.draw(elements.modifiedHistogram)

        #paint the modified image
        imageData.data.set(modifiedPixels)
        ctx.putImageData(imageData, 0, 0, 0, 0, width, height)

        #done
        promise.fulfil(true)

      ColorBalanceWorker.postMessage(pixelData)

    promise


  appendImageAndCanvasGroup = (width, height, text) ->

    #original iamge and modified image elements
    container = document.getElementById("container")
    div = document.createElement("div")
    container.appendChild(div)

    div.textContent = text

    div = document.createElement("div")
    container.appendChild(div)

    span = document.createElement("span")
    image = document.createElement("canvas")
    span.appendChild(image)
    div.appendChild(span)


    modifiedImage = document.createElement("canvas")
    div.appendChild(modifiedImage)


    #modified image histgram and  original histogram
    div = document.createElement("div")
    container.appendChild(div)

    histogram = document.createElement("canvas")
    histogram.id = "histogram"
    histogram.width = width
    histogram.height = height
    div.appendChild(histogram)

    modifiedHistogram = document.createElement("canvas")
    modifiedHistogram.id = "histogram"
    modifiedHistogram.width = width
    modifiedHistogram.height = height
    div.appendChild(modifiedHistogram)

    return {
      "originalImage": image
      "originalHistogram": histogram
      "modifiedImage": modifiedImage
      "modifiedHistogram": modifiedHistogram
    }

  processImage("images/IMG_0002.jpg", 100)
  processImage("images/IMG_0002.jpg", 200)
  processImage("images/IMG_0002.jpg", 300)
  processImage("images/IMG_0002.jpg", 400)
  processImage("images/IMG_0002.jpg", 500)

