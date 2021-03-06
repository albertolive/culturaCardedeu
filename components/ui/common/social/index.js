import Link from "next/link";

const renderWeb = (link) => (
  <Link href={link}>
    <a className="no-underline" rel="noopener noreferrer" target="_blank">
      <button className="bg-gray-800 hover:bg-gray-800/80 px-2 py-2 text-sm font-semibold text-white inline-flex items-center space-x-2 rounded">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 490 490"
          className="w-5 h-5 fill-current"
        >
          <path d="M245 0C109.69 0 0 109.69 0 245s109.69 245 245 245 245-109.69 245-245S380.31 0 245 0zM31.401 260.313h52.542c1.169 25.423 5.011 48.683 10.978 69.572H48.232c-9.349-21.586-15.084-45.027-16.831-69.572zm289.179-30.625c-1.152-24.613-4.07-47.927-8.02-69.572h50.192c6.681 20.544 11.267 43.71 12.65 69.572H320.58zm-114.2 100.197c-4.322-23.863-6.443-47.156-6.836-69.572h90.913c-.392 22.416-2.514 45.709-6.837 69.572h-77.24zm70.568 30.625c-7.18 27.563-17.573 55.66-31.951 83.818-14.376-28.158-24.767-56.255-31.946-83.818h63.897zm-76.987-130.822c1.213-24.754 4.343-48.08 8.499-69.572h73.08c4.157 21.492 7.286 44.818 8.5 69.572h-90.079zm15.381-100.196c9.57-37.359 21.394-66.835 29.656-84.983 8.263 18.148 20.088 47.624 29.66 84.983h-59.316zm90.728 0c-9.77-40.487-22.315-73.01-31.627-94.03 11.573 8.235 50.022 38.673 76.25 94.03H306.07zM215.553 35.46c-9.312 21.02-21.855 53.544-31.624 94.032h-44.628c26.231-55.362 64.683-85.8 76.252-94.032zM177.44 160.117c-3.95 21.645-6.867 44.959-8.019 69.572h-54.828c1.383-25.861 5.968-49.028 12.65-69.572h50.197zm-93.464 69.571H31.401c1.747-24.545 7.481-47.984 16.83-69.572h46.902c-6.011 20.886-9.929 44.13-11.157 69.572zm30.601 30.625h54.424c.348 22.454 2.237 45.716 6.241 69.572h-47.983c-6.738-20.597-11.339-43.77-12.682-69.572zm67.007 100.197c7.512 31.183 18.67 63.054 34.744 95.053-10.847-7.766-50.278-38.782-77.013-95.053h42.269zm92.051 95.122c16.094-32.022 27.262-63.916 34.781-95.122h42.575c-26.655 56.558-66.255 87.317-77.356 95.122zm41.124-125.747c4.005-23.856 5.894-47.118 6.241-69.572h54.434c-1.317 25.849-5.844 49.016-12.483 69.572h-48.192zm91.292-69.572h52.548c-1.748 24.545-7.482 47.985-16.831 69.572h-46.694c5.967-20.889 9.808-44.149 10.977-69.572zm-.032-30.625c-1.228-25.443-5.146-48.686-11.157-69.572h46.908c9.35 21.587 15.083 45.026 16.83 69.572h-52.581zm19.29-100.196h-41.242c-13.689-32.974-31.535-59.058-48.329-78.436a215.49 215.49 0 0 1 89.571 78.436zM154.252 51.06c-16.792 19.378-34.636 45.461-48.324 78.432H64.691C86.48 95.598 117.52 68.321 154.252 51.06zm-89.56 309.45h40.987c13.482 32.637 31.076 58.634 47.752 78.034-36.372-17.282-67.113-44.396-88.739-78.034zm271.884 78.03c16.672-19.398 34.263-45.395 47.742-78.03h40.99c-21.624 33.636-52.363 60.748-88.732 78.03z" />
        </svg>
        <span>Web</span>
      </button>
    </a>
  </Link>
);

const renderFacebook = (link) => (
  <Link href={link}>
    <a className="no-underline" rel="noopener noreferrer" target="_blank">
      <button className="bg-[#1B74E4] hover:bg-[#1B74E4]/80 px-2 py-2 text-sm font-semibold text-white inline-flex items-center space-x-2 rounded">
        <svg
          className="w-5 h-5 fill-current"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        <span>Facebook</span>
      </button>
    </a>
  </Link>
);

const renderTwitter = (link) => (
  <Link href={link}>
    <a className="no-underline" rel="noopener noreferrer" target="_blank">
      <button className="bg-[#1d9bf0] hover:bg-[#1d9bf0]/80 px-2 py-2 text-sm font-semibold text-white inline-flex items-center space-x-2 rounded">
        <svg
          className="w-5 h-5 fill-current"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
        <span>Twitter</span>
      </button>
    </a>
  </Link>
);

const renderInstagram = (link) => (
  <Link href={link}>
    <a className="no-underline" rel="noopener noreferrer" target="_blank">
      <button className="bg-gradient-to-r from-[#4c68d7] via-purple-500 to-pink-500 hover:from-pink-500 hover:to-yellow-500 px-2 py-2 text-sm font-semibold text-white inline-flex items-center space-x-2 rounded">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 fill-current"
          role="img"
          viewBox="0 0 24 24"
        >
          <path d="M8 3C5.243 3 3 5.243 3 8v8c0 2.757 2.243 5 5 5h8c2.757 0 5-2.243 5-5V8c0-2.757-2.243-5-5-5H8zm0 2h8c1.654 0 3 1.346 3 3v8c0 1.654-1.346 3-3 3H8c-1.654 0-3-1.346-3-3V8c0-1.654 1.346-3 3-3zm9 1a1 1 0 0 0-1 1 1 1 0 0 0 1 1 1 1 0 0 0 1-1 1 1 0 0 0-1-1zm-5 1c-2.757 0-5 2.243-5 5s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3z" />
        </svg>
        <span>Instagram</span>
      </button>
    </a>
  </Link>
);

const renderTelegram = (link) => (
  <Link href={link}>
    <a className="no-underline" rel="noopener noreferrer" target="_blank">
      <button className="bg-[#2AABEE] hover:bg-[#2AABEE]/80 px-2 py-2 text-sm font-semibold text-white inline-flex items-center space-x-2 rounded">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 fill-current"
          role="img"
          viewBox="0 0 24 24"
        >
          <path d="M18.384 22.779a1.19 1.19 0 0 0 1.107.145 1.16 1.16 0 0 0 .724-.84C21.084 18 23.192 7.663 23.983 3.948a.78.78 0 0 0-.26-.758.8.8 0 0 0-.797-.14C18.733 4.602 5.82 9.447.542 11.4a.827.827 0 0 0-.542.799c.012.354.25.661.593.764 2.367.708 5.474 1.693 5.474 1.693s1.452 4.385 2.209 6.615c.095.28.314.5.603.576a.866.866 0 0 0 .811-.207l3.096-2.923s3.572 2.619 5.598 4.062Zm-11.01-8.677 1.679 5.538.373-3.507 10.185-9.186a.277.277 0 0 0 .033-.377.284.284 0 0 0-.376-.064L7.374 14.102Z" />
        </svg>
        <span>Telegram</span>
      </button>
    </a>
  </Link>
);

export default function Social({ links }) {
  return (
    <div className="mt-2">
      <div className="flex flex-col xs:flex-row items-start xs:items-center space-x-0 xs:space-x-3">
        {links.web && renderWeb(links.web)}
        {links.twitter && renderTwitter(links.twitter)}
        {links.instagram && renderInstagram(links.instagram)}
        {links.telegram && renderTelegram(links.telegram)}
        {links.facebook && renderFacebook(links.facebook)}
      </div>
    </div>
  );
}
