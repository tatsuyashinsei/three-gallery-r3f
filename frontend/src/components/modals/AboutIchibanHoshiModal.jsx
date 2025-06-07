import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AboutIchibanHoshiModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-base-100 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          {/* ヘッダー */}
          <div className="sticky top-0 z-10 bg-base-100 px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold">私たちについて</h2>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-circle"
            >
              <X />
            </button>
          </div>

          {/* コンテンツ */}
          <div className="p-6 space-y-8">
            {/* いちばん星の目指すもの */}
            <section>
              <h3 className="text-xl font-bold mb-4">いちばん星の目指すもの</h3>
              <ul className="list-disc list-inside space-y-2 text-base-content/80">
                <li>障がいがあっても、楽しく過ごせる、行ったらホッとできる、そんな居場所を提供します。</li>
                <li>障がい者・児を持つ家族が気軽に集え、悩みなどを語れる場を提供します。</li>
                <li>今置かれている障がい者（児）の現状を、社会に訴えかけていき、平等な社会作り"を目指します。</li>
                <li>いちばん星に関わる人たちみんなが笑顔でいられる団体でありたいと思っています。</li>
              </ul>
            </section>

            {/* 概要 */}
            <section>
              <h3 className="text-xl font-bold mb-4">概要</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">名称</h4>
                    <p className="text-base-content/80">特定非営利活動法人 いちばん星</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">所在地</h4>
                    <p className="text-base-content/80">〒578-0941 大阪府東大阪市岩田町5-8-13</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">TEL</h4>
                    <p className="text-base-content/80">072-927-3279</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">FAX</h4>
                    <p className="text-base-content/80">072-921-3335</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">設立年月日</h4>
                    <p className="text-base-content/80">2006年3月27日</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">代表理事</h4>
                    <p className="text-base-content/80">吉川 芽莉</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">事業内容</h4>
                  <ul className="list-disc list-inside text-base-content/80 space-y-1">
                    <li>就労継続支援B型</li>
                    <li>生活介護</li>
                    <li>相談支援事業所</li>
                  </ul>
                  <div className="mt-4">
                    <p className="font-semibold">グループ会社 株式会社かささぎ</p>
                    <ul className="list-disc list-inside text-base-content/80">
                      <li>共同生活援助</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 活動内容 */}
            <section>
              <h3 className="text-xl font-bold mb-4">活動内容</h3>
              <ul className="list-disc list-inside space-y-2 text-base-content/80">
                <li>障がい児・者、そのご家族同士の交流を目的としたイベントの開催</li>
                <li>障がい児・者のきょうだいの会「キラリ」の活動</li>
                <li>会報誌「いちばん星TIMES」の発行</li>
                <li>講師派遣（障がい児・者のきょうだいについての講師・講演）</li>
              </ul>
            </section>

            {/* 沿革 */}
            <section>
              <h3 className="text-xl font-bold mb-4">沿革</h3>
              <div className="space-y-4">
                {[
                  { year: '2006年3月', events: ['NPO法人 いちばん星 設立', 'ボランティア・イベント・講演活動を開催'] },
                  { year: '2008年8月', events: ['きょうだい会「キラリ」発足'] },
                  { year: '2011年4月', events: ['東日本大震災支援・義援金活動参加'] },
                  { year: '2006年〜2018年', events: ['ふれあい祭り、バーベキュー大会、お茶会、いちばん星カット、きょうだい会、宿泊体験、日帰りバスツアー、クリスマスなど'] },
                  { year: '2018年9月', events: ['就労継続支援B型 新星（現在の超新星の場所に） 開所'] },
                  { year: '2020年2月', events: ['グループホーム「ひこぼし」開所'] },
                  { year: '2020年11月', events: ['グループホーム「ひこぼしII」開所'] },
                  { year: '2021年1月', events: ['就労継続支援B型 新星（現在の場所に） 移動', '相談支援 「いちばん星」・生活介護「新星」 開所'] },
                  { year: '2021年2月', events: ['グループホーム「おりひめ」開所'] },
                  { year: '2022年9月', events: ['就労継続支援B型「超新星」開所'] },
                  { year: '2022年3月', events: ['グループホーム「あまのがわ」開所'] },
                  { year: '2022年4月', events: ['グループホーム「ひこぼしIII」開所'] }
                ].map((period, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="font-semibold w-32 flex-shrink-0">{period.year}</div>
                    <div className="flex-1">
                      <ul className="space-y-1 text-base-content/80">
                        {period.events.map((event, eventIndex) => (
                          <li key={eventIndex}>{event}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 決算報告 */}
            <section>
              <h3 className="text-xl font-bold mb-4">決算報告</h3>
              <div className="text-base-content/80">
                <p className="font-semibold">令和6年度決算報告</p>
                <p>いちばん星事業計画書令和6年3月期</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AboutIchibanHoshiModal; 