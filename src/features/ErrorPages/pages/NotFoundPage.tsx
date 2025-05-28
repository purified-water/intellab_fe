export function NotFoundPage() {
  return (
    <main className="grid min-h-full px-6 py-24 bg-white place-items-center sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-appPrimary">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
        <p className="mt-6 text-base leading-7 text-gray3">Sorry, we couldn’t find the page you’re looking for.</p>
        <div className="flex items-center justify-center mt-10 gap-x-6">
          <a
            href={"/"}
            className="rounded-md bg-appPrimary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-appPrimary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-appPrimary"
          >
            Go back home
          </a>
          <a href="#" className="text-sm font-semibold text-gray1 hover:text-gray2">
            Contact support <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </main>
  );
}
