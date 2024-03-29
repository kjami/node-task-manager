<h1>A node js API for task manager.</h1>

API is hosted on http://task-manager.kish.rocks

For running project locally, add the following environment variables in <code>./config/dev.env</code> and then run <code>npm run dev</code>

Following are the list of API methods
<ul>
    <li>POST \users -> To create users. Requires name, email and password as parameters. Also accepts age.</li>
    <li>POST \user\login -> To log user in. Requires email and password as parameters.</li>
    <li>POST \user\logout -> To log out the user from current device. Needs Auth.</li>
    <li>POST \user\logout\all -> To log out the user from all logged-in devices. Needs Auth.</li>
    <li>POST \users\me\avatar -> To upload an image (jpg, jpeg, png) as profile picture. Requires 'form-data' with image through 'avatar' property in parameters. Needs Auth.</li>
    <li>DELETE \users\me\avatar -> To remove an image as profile picture. Needs Auth.</li>
    <li>GET \users\me -> Gets the current user information. Needs Auth.</li>
    <li>PATCH \users\me -> Update the current user information. Needs Auth.</li>
    <li>DELETE \users\me -> Delets the current user. Needs Auth.</li>
    <li>POST \tasks -> To create task. Requires description and completed as parameters. Needs Auth.</li>
    <li>GET \tasks -> To get tasks of a user. Accepts description and completed as query params. For pagination, accepts page and limit. For sorting, accepts sortBy. Needs Auth.</li>
    <li>GET \tasks\:id -> To get a task. Task Id is required in URL. Needs Auth.</li>
    <li>PATCH \tasks\:id -> To update a task. Task Id is required in URL. Needs Auth.</li>
    <li>DELETE \tasks\:id -> To delete a task. Task Id is required in URL. Needs Auth.</li>
</ul>
