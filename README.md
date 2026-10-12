# usage-battery

Claude Code 프롬프트 입력창 위에 5시간 / 주간 사용량을 휴대폰 배터리처럼 보여주는 mod입니다.

```
5시간 ▰▰▰▰▰▰▰▰▱▱    주간 ▰▰▰▰▰▰▰▰▰▱
```

- 채워진 칸 = 남은 양 (에메랄드 → 70% 이상 사용 시 골드 → 90% 이상 가넷)
- 마우스를 올리면 사용률(%)과 초기화까지 남은 시간이 나타납니다
- Pro / Max 구독 계정에서만 표시됩니다

## 설치

터미널에서 Claude Code를 열고 프롬프트에 입력하세요:

```
/plugin install usage-battery --marketplace Lui80/usage-battery
```

마켓플레이스 추가를 물으면 `y`, 범위는 `user`를 고르세요. 그 다음 Claude Code를 다시 시작하면 적용됩니다.
