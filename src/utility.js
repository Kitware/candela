export let failValue = (value, warning, fail) => {
  if (warning > fail) {
    // Lower values are better.
    return (value <= fail);
  } else {
    return (value >= fail);
  }
}

export let warningValue = (value, warning, fail) => {
  if (warning > fail) {
    // Lower values are better.
    return (value <= warning);
  } else {
    return (value >= warning);
  }
}
