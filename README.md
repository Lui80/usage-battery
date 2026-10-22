# usage-battery

Claude Code 프롬프트 입력창 위에 5시간 / 주간 사용량을 휴대폰 배터리처럼 보여주는 mod입니다.

```
5시간 ▰▰▰▰▰▰▰▰▱▱    주간 ▰▰▰▰▰▰▰▰▰▱
```

- 채워진 칸 = 남은 양 (에메랄드 → 70% 이상 사용 시 골드 → 90% 이상 가넷)
- 마우스를 올리면 사용률(%)과 초기화까지 남은 시간이 나타납니다
- Pro / Max 구독 계정에서만 표시됩니다

### 화면별 표시

| 화면 | 표시 |
|---|---|
| 터미널 · 데스크톱 앱 | 입력창 위 배터리 바 (위 모양) |
| 모바일 앱 | 입력창 위 칸이 없어서, 상태줄에 텍스트 한 줄로 표시 |

```
5시간 ▰▰▰▰▰▰▱▱▱▱ 38% · 주간 ▰▰▰▰▰▰▰▰▱▱ 21%
```

모바일 앱이 세션에 연결된 동안에만 상태줄 텍스트가 나오고, 연결이 끊기면 지워집니다.

## 설치

터미널에서 Claude Code를 열고 프롬프트에 입력하세요:

```
/plugin install usage-battery --marketplace Lui80/usage-battery
```

마켓플레이스 추가를 물으면 `y`, 범위는 `user`를 고르세요. 그 다음 Claude Code를 다시 시작하면 적용됩니다.

### 클라우드 세션(claude.ai/code, 앱에서 여는 원격 세션)

클라우드 세션은 매번 새 컨테이너에서 시작해서, 위처럼 한 번 설치한 것이 남지 않아요. 저장소의 `.claude/settings.json`에 `enabledPlugins`를 넣어 두어도 클라우드 세션은 설치를 묻지 않고 넘어가서 mod가 켜지지 않아요.

그래서 클라우드 환경의 **Setup script**에 아래 두 줄을 넣어 주세요. 세션이 시작되기 전에 설치되어, 새 세션마다 바로 켜져요.

```bash
claude plugin marketplace add Lui80/usage-battery || true
claude plugin install usage-battery@usage-battery-mods --scope user || true
```

이미 열려 있던 세션에는 적용되지 않으니, 스크립트를 넣은 뒤 새 세션을 여세요.
