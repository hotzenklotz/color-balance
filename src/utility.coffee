define [], ->

  Utility =

    memoize : (func, key) ->

      memo = {}
      return ->
        if memo.hasOwnProperty(key)
          memo[key]
        else
          (memo[key] = func.apply(this, arguments))


    clamp : (min, max, value) ->

      Math.min(max, Math.max(min, value))