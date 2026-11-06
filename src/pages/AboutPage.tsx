import Card from '@/components/ui/Card'

const structure = [
  { folder: 'src/app/', desc: 'ที่เก็บ Redux store และ typed hooks (useAppDispatch, useAppSelector)' },
  { folder: 'src/services/', desc: 'การเชื่อมต่อ Firebase, ข้อมูลตัวอย่าง และ API สลับได้ด้วย VITE_DATA_SOURCE' },
  { folder: 'src/features/cars/', desc: 'ส่วนของรถ: slice, รายการรถ, หน้าข้อมูลรถ, ฟอร์มแก้ไข และประวัติ' },
  { folder: 'src/components/', desc: 'ส่วนประกอบหน้าจอที่ใช้ร่วมกัน เช่น Button, Field, Dialog, LicensePlate, Header, Footer' },
  { folder: 'src/pages/', desc: 'หน้าเว็บแต่ละหน้าตามเส้นทาง (route)' },
  { folder: 'src/types/', desc: 'TypeScript types ที่ใช้ร่วมกัน' },
]

const code = 'rounded bg-tint px-2 py-1 text-sm'

export default function AboutPage() {
  return (
    <div className="max-w-[44rem] space-y-12">
      <title>เกี่ยวกับระบบ - CarCycle</title>

      <div className="space-y-4">
        <h1>เกี่ยวกับระบบ</h1>
        <p>
          CarCycle เก็บข้อมูลรถทุกคัน แต่ละคันมีหน้าข้อมูลของตัวเองที่เปิดได้ด้วยการสแกนคิวอาร์โค้ด
          หน้านั้นแสดงข้อมูลประกันภัย การบำรุงรักษา และประวัติการแก้ไขว่าใครเปลี่ยนอะไร เมื่อไร
        </p>
        <p>
          แอปใช้ข้อมูลตัวอย่างได้โดยตั้งค่า <code className={code}>VITE_DATA_SOURCE=mock</code> ถ้าใช้ Firebase
          ให้ตั้งค่า <code className={code}>VITE_DATA_SOURCE=firestore</code> ถ้าใช้ CarCycleService ให้ตั้งค่า{' '}
          <code className={code}>VITE_DATA_SOURCE=api</code> พร้อม <code className={code}>VITE_API_BASE_URL</code>{' '}
          โดยไม่ต้องแก้โค้ด
        </p>
      </div>

      <section aria-labelledby="structure-heading">
        <h2 id="structure-heading" className="border-b-2 border-ink pb-2">
          โครงสร้างโฟลเดอร์
        </h2>
        <dl>
          {structure.map((item) => (
            <div key={item.folder} className="border-b border-rule py-4">
              <dt>
                <code className={code}>{item.folder}</code>
              </dt>
              <dd className="mt-2">{item.desc}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Card>
        <h2>การจัดการสถานะ</h2>
        <ul className="mt-4 space-y-2">
          <li>
            <span className="font-semibold">Redux:</span> ข้อมูลจากเซิร์ฟเวอร์และสถานะที่ใช้ร่วมกัน เช่น รถ ประวัติ
          </li>
          <li>
            <span className="font-semibold">useState:</span> ค่าในฟอร์ม คำค้นหา และการเปิดโหมดแก้ไข
          </li>
          <li>
            <span className="font-semibold">Firestore SDK:</span> อ่านและเขียนข้อมูลผ่าน async thunks ใน Redux slices
          </li>
        </ul>
      </Card>
    </div>
  )
}
