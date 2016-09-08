# Candela R htmlwidgets package

## Installation from GitHub

From [RStudio](https://www.rstudio.com/):

```
install.packages('devtools')
devtools::install_github('Kitware/candela', subdir='R/candela')
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

## Development install

If you are developing or testing changes to the Candela R integration
from a cloned version of the Candela repository,
navigate to the `candela/R/candela` directory in the Files tab in
[RStudio](https://www.rstudio.com/) and select Set As Working Directory
from the More menu. Then run:

```
install.packages('devtools')
devtools::install()
library(candela)
```
