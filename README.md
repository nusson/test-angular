# Test

This is a basic test app to play with Angular

| note that it is really basic - it is just to play with some features.

- route guard
  * home (/) is protected --> redirect to `/login` if not connected
  * may retrieve session (ocalStorage)
  * logout will remove session
  * login over login will just override

- form validation
  * login page use `ReactiveFormsModule` with a debug to play with validation
  * chatt app use `FormsModule` as it is just to bind data

- data service (message stack)
  * add / remove messages
  * play with `signals` for reactivity
  * (don't know if prefere rx... signals seems fine)

- app-composition
  * eg chat form actions to (add message) is a sub-component
  * duplicated to simulate an other user

- animation api
  * test the *weird?* animation api
  * ensure keeping index in list during anim ;)
