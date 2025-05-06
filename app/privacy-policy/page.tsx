import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { SpotlightSearch } from '@/components/spotlight-search'
import { getAllArticles } from '@/lib/markdown'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function PrivacyPolicyPage() {
  const allArticles = await getAllArticles()

  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8 w-full flex-grow">
        <Header articles={allArticles} />
        <SpotlightSearch articles={allArticles} isMobile={true} />

        <main className="w-full max-w-4xl mx-auto">
          <div className="bg-white p-6 sm:p-8 rounded shadow-sm dark:bg-gray-800 dark:text-white">
            <Link
              href="/"
              className="text-gray-600 hover:text-black flex items-center mb-6 dark:text-gray-300 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              ホームに戻る
            </Link>
            <h1 className="text-3xl font-bold mb-8">プライバシーポリシー</h1>

            <div className="prose max-w-none dark:prose-invert">
              <p>
                ガジェモティ（以下、「当サイト」）は、ユーザーの個人情報について以下のとおりプライバシーポリシーを定めます。このプライバシーポリシーは、当サイトがどのような個人情報を収集し、どのように利用・保護するかを説明しています。
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">1. 個人情報の収集について</h2>
              <p>
                当サイトでは、お問い合わせフォームなどを通じて、お名前、メールアドレスなどの個人情報をご提供いただく場合があります。また、当サイトへのアクセス情報（IPアドレス、ブラウザの種類、アクセス日時など）を自動的に収集する場合があります。
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">2. 個人情報の利用目的</h2>
              <p>当サイトでは、収集した個人情報を以下の目的で利用します。</p>
              <ul className="list-disc pl-6 mb-4">
                <li>お問い合わせに対する回答</li>
                <li>サービスの提供・改善</li>
                <li>新機能・更新情報のお知らせ</li>
                <li>利用状況の分析</li>
                <li>法令に基づく場合や公的機関からの要請に対応する場合</li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4">3. 個人情報の第三者提供</h2>
              <p>当サイトは、以下の場合を除き、収集した個人情報を第三者に提供することはありません。</p>
              <ul className="list-disc pl-6 mb-4">
                <li>法令に基づく場合</li>
                <li>人の生命、身体または財産の保護のために必要がある場合</li>
                <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
                <li>
                  国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合
                </li>
                <li>ユーザーの同意がある場合</li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4">4. Cookieの使用について</h2>
              <p>
                当サイトでは、ユーザーの利便性向上のためにCookieを使用しています。Cookieとは、ウェブサイトがユーザーのコンピュータに一時的に保存する小さなテキストファイルです。
              </p>
              <p>
                Cookieを通じて収集される情報には、IPアドレス、ブラウザの種類、言語設定、アクセス日時、滞在時間などが含まれます。これらの情報は匿名で収集され、個人を特定するものではありません。
              </p>
              <p>
                ユーザーはブラウザの設定からCookieの受け入れを拒否することができますが、その場合、当サイトの一部の機能が正常に動作しない可能性があります。
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">5. アクセス解析ツールについて</h2>
              <p>
                当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を使用しています。Googleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。
              </p>
              <p>
                Googleアナリティクスの利用規約およびプライバシーポリシーに関する詳細は、以下のリンクをご覧ください。
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <a
                    href="https://marketingplatform.google.com/about/analytics/terms/jp/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Googleアナリティクス利用規約
                  </a>
                </li>
                <li>
                  <a
                    href="https://policies.google.com/privacy?hl=ja"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Googleプライバシーポリシー
                  </a>
                </li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4">6. セキュリティ対策</h2>
              <p>
                当サイトでは、個人情報の漏洩、滅失、毀損などを防ぐために、適切なセキュリティ対策を実施しています。ただし、インターネット上での通信は完全に安全ではないため、情報の漏洩などのリスクがあることをご了承ください。
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">7. プライバシーポリシーの変更</h2>
              <p>
                当サイトは、必要に応じて本プライバシーポリシーを変更することがあります。変更後のプライバシーポリシーは、当サイトに掲載した時点から効力を生じるものとします。
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">8. お問い合わせ先</h2>
              <p>本プライバシーポリシーに関するお問い合わせは、以下の連絡先までお願いいたします。</p>
              <p className="mb-4">
                運営者: ガジェモティ
                <br />
                メールアドレス: momomomomotty.co18=gmail.com（「=」を「@」に置き換えてください）
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">最終更新日: 2025年5月7日</p>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
