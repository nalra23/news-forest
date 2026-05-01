import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'

export function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-6 desktop:py-10">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold desktop:text-3xl">개인정보처리방침</h1>
        <p className="text-sm text-fg-muted">마지막 업데이트: 2026-05-02</p>
      </header>

      <p className="text-sm leading-relaxed text-foreground">
        News Forest(이하 "서비스")는 한국 개인정보보호법(PIPA)에 따라 다음과 같이
        개인정보를 처리합니다. 본 방침은 MVP 단계 기준이며, 정식 출시 시 갱신됩니다.
      </p>

      <article className="space-y-6 text-sm leading-relaxed text-foreground">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">
            1. 수집하는 개인정보 항목과 수집 방법
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium">디바이스 식별 해시</span>: 브라우저의
              canvas signature, User-Agent, 화면 해상도, 시간대, 언어, CPU 코어
              수를 조합한 SHA-256 해시. 원본은 저장되지 않으며 해시만 서버에
              보관됩니다.
            </li>
            <li>
              <span className="font-medium">자동 생성 닉네임</span>: 서버에서 의미
              없는 단어 조합으로 자동 생성. 사용자 입력 정보 아님.
            </li>
            <li>
              <span className="font-medium">관심 카테고리</span>: 사용자가 직접
              선택한 콘텐츠 카테고리.
            </li>
            <li>
              <span className="font-medium">활동 데이터</span>: 기사 완독 기록,
              워터링(다른 사용자 응원) 기록, 포인트 변동 내역, 나무 성장 단계 변경
              기록.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">2. 수집·이용 목적</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>익명 사용자 식별 (재방문 시 동일 사용자 인식)</li>
            <li>게이미피케이션 게임 루프 운영 (포인트·나무·연속 읽기)</li>
            <li>서비스 운영 통계 및 품질 개선</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">3. 보유 및 이용 기간</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>사용자가 "데이터 삭제"를 요청하기 전까지 보유합니다.</li>
            <li>
              삭제 요청 시 식별자(anonymous_hash·nickname)는 즉시 무효화됩니다.
            </li>
            <li>
              활동 기록(포인트 거래·읽기 세션 등)은 식별자 분리 후 통계·감사 목적으로
              익명 상태로 보존됩니다.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">4. 개인정보의 제3자 제공</h2>
          <p>제공하지 않습니다.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">5. 처리 위탁</h2>
          <ul className="list-disc pl-5">
            <li>데이터베이스 호스팅: Neon Database Inc. (미국·싱가포르 리전)</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">6. 정보주체의 권리</h2>
          <p>
            이용자는 개인정보보호법 §35·§36·§37에 따라 다음 권리를 행사할 수
            있습니다:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <span className="font-medium">열람권</span>: 설정 &gt; 활동 기록 /
              통계 페이지에서 본인 데이터를 확인할 수 있습니다.
            </li>
            <li>
              <span className="font-medium">삭제권</span>: 설정 &gt; 데이터 관리
              &gt; 데이터 초기화에서 즉시 행사할 수 있습니다.
            </li>
            <li>
              <span className="font-medium">처리정지권</span>: 데이터 삭제로
              사실상 처리가 정지됩니다. 별도 정지만 원하시는 경우 아래 문의처로
              연락주세요.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">7. 안전성 확보 조치</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>모든 통신은 HTTPS로 암호화됩니다 (운영 환경 기준).</li>
            <li>
              디바이스 식별 정보는 원본을 저장하지 않고 SHA-256 해시 형태로만
              보관합니다.
            </li>
            <li>개인정보 최소 수집 원칙을 따릅니다.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">8. 처리방침의 변경</h2>
          <p>
            본 방침이 변경되는 경우 서비스 내 공지사항을 통해 통지합니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">9. 개인정보 보호책임자</h2>
          <ul className="list-disc pl-5">
            <li>
              이메일: (출시 시 등록 예정 — MVP 단계 placeholder)
            </li>
          </ul>
        </section>
      </article>

      <div className="pt-2">
        <Link to="/settings">
          <Button variant="ghost" size="sm">
            ← 설정으로 돌아가기
          </Button>
        </Link>
      </div>
    </div>
  )
}
