#' Candela
#'
#' Interoperable web visualization components.
#'
#' @import htmlwidgets
#'
#' @export
candela <- function(name, width = NULL, height = NULL, elementId = NULL, ...) {

  # forward options using x
  x = list(
    name = name,
    options = list(...)
  )

  attr(x, 'TOJSON_ARGS') <- list(dataframe = 'rows', rownames = TRUE)

  # create widget
  htmlwidgets::createWidget(
    name = 'candela',
    x,
    width = width,
    height = height,
    package = 'candela',
    elementId = elementId
  )
}

#' Shiny bindings for candela
#'
#' Output and render functions for using candela within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a candela
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name candela-shiny
#'
#' @export
candelaOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'candela', width, height, package = 'candela')
}

#' @rdname candela-shiny
#' @export
renderCandela <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, candelaOutput, env, quoted = TRUE)
}
