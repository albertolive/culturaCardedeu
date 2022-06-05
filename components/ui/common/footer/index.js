export default function Footer() {
  return (
    <footer className="bg-gray-900 ">
      <div className="container mx-auto px-6">
        <div className="mt-5 flex flex-col items-center">
          <div className="py-4">
            <div className="text-white text-sm text-primary-2 font-bold text-center">
              © {new Date().getFullYear()} Cultura Cardedeu <br />
              <a
                className="hover:text-[#ECB84A]"
                href="mailto:hola@culturacardedeu.com"
              >
                hola@culturacardedeu.com
              </a>
              <div className="flex space-x-2">
                <a
                  className="hover:text-[#ECB84A]"
                  href="https://twitter.com/culturacardedeu"
                >
                  Twitter
                </a>
                <a
                  className="hover:text-[#ECB84A]"
                  href="https://t.me/culturacardedeu"
                >
                  Telegram
                </a>
                <a
                  className="hover:text-[#ECB84A]"
                  href="https://www.facebook.com/culturacardedeu"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
