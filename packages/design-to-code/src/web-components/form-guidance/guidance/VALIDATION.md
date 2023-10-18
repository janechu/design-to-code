<!-- title: Validation -->

# Validation

The form itself does not assess JSON schema against data, a separate service can be used leveraging [AJV](https://ajv.js.org/). What the form will do is when recieving messages with type `"validation"` it will apply any errors to form elements based on the error list produced by AJV. These are then reported once the form element has been been focused and subsequantly defocused.

An additional AJV validator messages web component may be used in conjunction with both the AJV service and the form, allowing the complete error list to be always visible outside of the form.