import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-md mt-8 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center text-center space-y-6">
          <nav className="w-full">
            <ul className="flex flex-col md:flex-row items-center justify-center md:gap-8">
              <li className="w-full md:w-auto py-3 md:py-0">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white text-xs block py-1"
                >
                  ホーム
                </Link>
              </li>
              <li className="w-full md:w-auto py-3 md:py-0">
                <Link
                  href="/privacy-policy"
                  className="text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white text-xs block py-1"
                >
                  プライバシーポリシー
                </Link>
              </li>
              <li className="w-full md:w-auto py-3 md:py-0">
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white text-xs block py-1"
                >
                  利用規約
                </Link>
              </li>
              <li className="w-full md:w-auto py-3 md:py-0">
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white text-xs block py-1"
                >
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </nav>

          <div className="text-gray-500 dark:text-gray-400 text-xs">
            Copyright &copy; 2025 ガジェモティ All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  )
}
