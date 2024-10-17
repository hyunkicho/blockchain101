# open zeppelin Governance

Openzepplin wizard의 governor와 openzepplin에서 지원하는 Timelock 코드를 이용하여 만든 tally와 연동 가능한 ERC20 + Timelock이 들어간 컨트렉트 입니다.
governance를 먼저 학습하시고 보는 것을 추천드립니다.

기존의 ERC721의 경우 Timelock이 들어가지 않았었기 때문에 최신 컨틀렉트 버전으로 다시 업데이트를 진행하였습니다.

실제 해당스크립트로 배포 되어 실행된 tally 링크
https://www.tally.xyz/gov/this-is-for-blockchain-101-dao-20-testing

script에서 deploy 하시고 grantAllRole을 하신 후에는 Tally에서 제공하는 UI를 사용하시면 됩니다.

*다만 Tally 테스트넷 같은 경우 오류가 매우 빈번하게 발생하며 오류가 발생할 시 조회가 되지 않기 때문에 토큰 개수가 제대로 안찍히거나 delegate를 하였음에도 반영이 잘 안된다면 다음 날 다시 확인해 보시는 것을 추천드립니다. (해당 오류는 4번의 시도 중 3번을 경험하였으나 하루 정도 뒤에 조회하니 진행이 잘 되었음을 확인할 수 있었습니다.)