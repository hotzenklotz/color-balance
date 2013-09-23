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


    next: ->

      if @running < MAX_RUNNING
        @running++

        func = @queue[@cursor]
        @cursor++
        console.log new Date().toString()
        promise = func()
        promise.then(@done.bind(@))

    done : ->

      @running--
      @next()