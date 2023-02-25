<div class="mb-8 rounded-xl border-2 border-neutral-200 bg-neutral-100 p-4 text-black">
	<p>
		<strong>Important:</strong>
		This is a work in progress. The documentation is not nearly complete! In the future, there will be
		a lot more content here, especially on how-to integrate <i>PingBack</i> with other services.
	</p>
</div>

<section>
	<h1>Quick Start</h1>
	<p class="max-w-xl">
		<i>PingBack</i> is a simple app which allows you to receive, store and view events. An event can
		represent anything from a user signing up, a payment made, a log from some other app and more.
	</p>
</section>

<section>
	<h1>How does it work?</h1>
	<p class="max-w-xl">
		There are three main concepts: <b>Projects</b>, <b>Channels</b> and finally <b>Events</b>.
		<br /><br />
		<i>Projects</i> allow you to separate your events into large groups of concern. For example, you
		might have a project for your contact form, another for your online shop and another for an
		application you are developing.
		<br /><br />
		<i>Channels</i> allow you to further separate events inside a project. For example in an online
		shop, you might find it helpful to have separate channels for orders, payments and shippments.
		<br />This makes it easy to filter events by channel with one click later on.
		<br /><br />
		<i>Events</i> are individual, immutable pieces of data. An event can be anything from a simple "user
		signed up" to a complex "javaScript error stacktrace". Events can be filtered.
	</p>
</section>

<section>
	<h1>Collecting your first event</h1>
	<p class="max-w-xl">
		After you created your first project and a channel, you need to create an API key for your
		project. An API key is necessary to publish an event, and can be revoked (deleted) at any time. <br
		/>
		<br /><i>todo: how to api key</i><br />
		After you have an api key you can publish your first event by sending a POST request to the following
		endpoint:
	</p>
</section>
