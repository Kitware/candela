# Candela R htmlwidgets package

## Install from Git checkout

To use the Candela R integration, open [RStudio](https://www.rstudio.com/),
navigate to this directory in the Files tab, and select Set As Working Directory
from the More menu. Then execute:

```
install.packages('devtools')
devtools::install()
library(candela)
```

## Usage

At this point you can use the `candela` visualization as follows:

```
candela('ScatterPlot', data=mtcars, x='mpg', y='wt', color='disp')
```

## Examples

The following Candela htmlwidgets examples are published to
[RPub](http://rpubs.com):

* [Cars UpSet](http://rpubs.com/jeffbaumes/cars-upset)
* [Cars OnSet](http://rpubs.com/jeffbaumes/cars-onset)
* [Iris LineUp](http://rpubs.com/jeffbaumes/iris-lineup)
