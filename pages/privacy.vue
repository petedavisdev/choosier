<template>
	<h1>Privacy policy</h1>

	<article>
		<h2>Personal data</h2>
		<p>
			Your email address will not be shared. It is only required to enable you
			to access and manage your account. No emails will be sent to you without
			your permission.
		</p>
		<p>No other personal data is required to user Choosier.</p>
		<p>
			Your 'choosername' is public, but it does not need to resemble your real
			name and you can change it <LinkTo :to="PATHS.account">here</LinkTo>.
		</p>
	</article>

	<article>
		<h2>Cookies</h2>
		<p>Choosier only uses essential cookies so that you can log in.</p>
		<p>No trackers. No advertising cookies. No analytics cookies.</p>
	</article>

	<article>
		<h2>Data processors</h2>
		<p>
			Choosier is built with
			<a href="https://supabase.com/" target="_blank" rel="noopener noreferrer"
				>Supabase</a
			>, which provides secure login and data storage.
		</p>
		<p>
			Images are stored by
			<a
				href="https://cloudinary.com/"
				target="_blank"
				rel="noopener noreferrer"
				>Cloudinary</a
			>.
		</p>
	</article>
</template>
