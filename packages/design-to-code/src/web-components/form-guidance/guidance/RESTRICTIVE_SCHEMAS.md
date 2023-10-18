<!-- title: Restrictive Schemas -->

# Restrictive Schemas

It is always recommended to create as restrictive schemas as possible. This way the form has as much data as possible when deciding what kind of form elements to display. The `"type"` should always be set. If unaccounted for properties exist this will cause issues as the form will not render them and may not allow the user to remove them if they are invalid.