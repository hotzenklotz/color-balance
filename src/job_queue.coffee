define ->

  MAX_RUNNING = 3

  class JobQueue

    constructor: ->

      @queue = []
      @cursor = 0
      @running = 0

    enqueue : (func, args...) ->

      wrapper = func.bind(@,args)
      @queue.push(wrapper)
      @next()


    next: =>

      if @running < MAX_RUNNING
        @running++

        if @cursor < @queue.length
          func = @queue[@cursor]
          @cursor++
          promise = func()
          promise.then(@done)

    done : =>

      @running--
      window.requestAnimationFrame(@next)
