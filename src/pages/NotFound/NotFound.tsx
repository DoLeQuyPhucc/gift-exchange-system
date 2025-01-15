import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        <img
          src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
          alt="Error 404 Animation"
          className="object-contain w-full h-full"
        />
      </div>
      <h1 className="mt-8 text-3xl font-bold md:text-4xl">
        Oops! Page Not Found
      </h1>
      <p className="mt-4 text-lg text-center text-gray-600 md:text-xl">
        The page you're looking for doesn't exist. It might have been moved or
        deleted.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
