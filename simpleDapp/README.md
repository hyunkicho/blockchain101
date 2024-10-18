# Simple Dapp

최소한의 프론트엔드 지식으로 만들 수 있는 메타마스크 예제를 찾기가 너무 어려워서 직접 만든 예제입니다.

STEP01)
먼저 EVM체인 아무체인이나 골라서 테스트넷 코인을 얻은 후 메타마스크에서 네트워크에 접속해 주시기 바랍니다.

네트워크 접속은 Chain list 라는 하단의 링크에서 원하시는 테스트네트워크를 선택하신 후에 connect wallet 버튼을 누르시면 됩니다.
  https://chainlist.org/

테스트넷 코인은 원하시는것 아무거나 받으면 되지만 아무 조건없이 받을 수 있는 아래 네트워크 코인들을 추천합니다.
위믹스 테스트넷 : https://wallet.test.wemix.com/faucet
메타디움 테스트넷 : https://testnetfaucet.metadium.com/

STEP02)
REMIX 환경에서 컨트렉트를 배포해줍니다.
메타마스크에 네트워크가 선택된 상태에서 배포시에 injected provider를 누르시면 메타마스크 계정과 연결이 되게 됩니다.
StorageEvent.sol을 해당 메타마스크로 배포를 해줍니다.

STEP03)
npm install 을 실행하여 모듈을 다 다운 받으신 후에
npm run start를 실행시키셔서 package.json에 있는 script에 지정된 node server.js 파일을 실행시킵니다.
이렇게 되면 실제로는 server.js가 실행되게 되며 server.js에서는 express를 사용하여 3000번 포트로 index.ejs 파일을 띄워주게 됩니다.
그 외의 백엔드 로직은 없으며 메타마크스에서 정보를 다 가져와서 통신을 하기 때문에 여러분들은 index.ejs에 있는 코드들만 보고 사용을 하시면됩니다.

STEP04)
주소창에 localhost:3000을 치시고 메타마스크에 리믹스에서 배포했던 지갑주소와 네트워크를 맞춰둔 후에
connect wallet 버튼을 누릅니다.
이후 버튼을 클릭해 트랜잭션을 날려보고 조회해보고 이벤트가 구독되는 로직을 봅니다.
여태까지 배웠던 ethers문법으로 구현이 되어 있으므로 배운 내용으로 바꿔서 간단한 Dapp을 메타마스크를 통해서 사용할 수 있습니다.

메타마스크 사용시 참고한 문서는 아래 문서입니다. 실제로는 react등의 프론트 프레임워크와 viem 같은 모듈들을 사용해서 더 안정적인 구조로 다양한 기능을 편리하게 사용할 수 있는 경우가 많기 때문에 해당 방식은 POC또는 학습용으로만 추천드립니다.
https://docs.metamask.io/wallet/tutorials/javascript-dapp-simple/