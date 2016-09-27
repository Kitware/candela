test_that('Candela does not produce any errors', {
  w <- candela('ScatterPlot', data = mtcars, x = 'disp', y = 'mpg')
})
