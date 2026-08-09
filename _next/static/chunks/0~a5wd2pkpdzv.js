(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,92177,a=>{"use strict";var t=a.i(88025),e=a.i(98461),r=a.i(26590),i=a.i(70098);let n=(0,i.default)("arrow-up-right",[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]]),o=(0,i.default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);var p=a.i(57664);String.raw`\operatorname{CAREER\_LEVEL\_COVERAGE}(t)=\frac{N_{\text{levels containing }t}}{N_{\text{career levels}}}`,String.raw`\operatorname{LEVEL\_LIFT}(t,l)=\frac{P(t\mid \text{career},l)+\alpha}{P(t\mid \text{career},\text{other levels})+\alpha}`,String.raw`\operatorname{LEVEL\_SPECIFICITY}=\operatorname{LEVEL\_LIFT}\times\operatorname{SOURCE\_DIVERSITY}\times\operatorname{UNIT\_COVERAGE}\times\operatorname{TERM\_DISTINCTIVENESS}`,String.raw`\operatorname{CURRENT\_LEVEL\_EVIDENCE}=\sum_{t\in\text{matched}}\operatorname{LEVEL\_SPECIFICITY}(t,l)`,String.raw`\operatorname{OTHER\_LEVEL\_EVIDENCE}=\max_{k\ne l}\sum_{t\in\text{matched}}\operatorname{LEVEL\_SPECIFICITY}(t,k)`,String.raw`\operatorname{LEVEL\_EVIDENCE\_MARGIN}=\operatorname{CURRENT\_LEVEL\_EVIDENCE}-\operatorname{OTHER\_LEVEL\_EVIDENCE}`,String.raw`\operatorname{TEXT\_RELEVANCE}=0.65\,\operatorname{NORMALIZED\_BM25F}+0.35\,\operatorname{JOB\_ANCHOR\_EVIDENCE}`,String.raw`\operatorname{SQF\_LEVEL\_PROFILE\_FIT}=0.35\,\operatorname{KNOWLEDGE\_DEPTH}+0.35\,\operatorname{TASK\_COMPLEXITY}+0.15\,\operatorname{AUTONOMY}+0.15\,\operatorname{RESPONSIBILITY}`,String.raw`\operatorname{ROADMAP\_STAGE\_FIT}=\operatorname{TITLE\_STAGE\_MARKER}`,String.raw`\operatorname{CONTENT\_SCORE}=0.60\,\operatorname{TEXT\_RELEVANCE}+0.20\,\operatorname{SQF\_LEVEL\_PROFILE\_FIT}+0.20\,\operatorname{ROADMAP\_STAGE\_FIT}`,String.raw`\operatorname{JOB\_RELEVANCE}_{\text{proposal}}=\operatorname{BM25F}+\operatorname{CAREER\_FIELD}+\operatorname{CAREER\_COMMON}+\operatorname{SUPPORTING\_EVIDENCE}`;let s={slug:"docker-openrouteservice-walking-time",section:"projects",title:"Docker 기반 OpenRouteService를 활용한 도보 소요 시간 계산",summary:"호출 제한 없이 대규모 도보 경로를 계산하기 위해 Docker로 OpenRouteService 로컬 서버를 구축하고, 인천 아파트 거래 50,670건의 역 접근 시간을 수집한 과정을 정리합니다.",updatedAt:"2026-08-03",tools:["Docker","OpenRouteService","OpenStreetMap","Python"],status:"연재 1/4",dataset:"인천 아파트 실거래 50,670건",keywords:["ORS","도보시간","공간 데이터","역세권"],body:[{heading:"1. 시작하기 앞서",paragraphs:[],blocks:[{type:"paragraph",text:"ORS(OpenRouteService)는 위치 데이터를 기반으로 경로 안내, 거리·시간 계산, 등시간권 범위 계산, 주소와 좌표 변환 등을 제공하는 지리공간 분석 서비스다."},{type:"list",items:["공식 ORS 서버와 API를 사용한다.","Docker로 자체 로컬 서버를 구성해 사용한다."]},{type:"image",src:"/content/docker-openrouteservice-walking-time/figure-01.png",alt:"OpenRouteService에서 제공하는 경로 탐색과 지리공간 분석 기능 화면",caption:"ORS는 이동수단별 경로와 거리·시간을 계산할 수 있다."},{type:"paragraph",text:"공식 서버는 일별·분당 호출 제한이 있어 대용량 좌표 쌍을 처리하기 어렵다. 이 프로젝트에서는 Docker로 로컬 ORS 서버를 만들고 대한민국 OpenStreetMap 파일로 도보 그래프를 직접 빌드했다."}]},{heading:"2. ORS 저장소와 지도 파일 준비",paragraphs:[],blocks:[{type:"paragraph",text:"GIScience의 openrouteservice 저장소를 내려받고, 그래프·설정·로그·지도 파일을 보관할 디렉터리를 만든다."},{type:"code",language:"bash",caption:"ORS 저장소와 작업 디렉터리 준비",code:`git clone https://github.com/GIScience/openrouteservice.git
cd openrouteservice
mkdir -p ors-docker/config ors-docker/elevation_cache ors-docker/graphs ors-docker/files ors-docker/logs`},{type:"image",src:"/content/docker-openrouteservice-walking-time/figure-02.png",alt:"ors-docker 아래에 config elevation_cache graphs files logs 폴더를 만든 터미널 화면",caption:"Docker 컨테이너와 공유할 다섯 개 디렉터리를 준비했다."},{type:"paragraph",text:"기본 예제 지도인 example-heidelberg.test.pbf 대신 Geofabrik의 south-korea-latest.osm.pbf를 내려받아 ors-docker/files에 둔다."},{type:"code",language:"bash",caption:"대한민국 OpenStreetMap PBF 내려받기",code:`cd ors-docker/files
wget https://download.geofabrik.de/asia/south-korea-latest.osm.pbf`}]},{heading:"3. 도보 프로필 서버 실행",paragraphs:[],blocks:[{type:"paragraph",text:"docker-compose.yml, ors-config.yml, ors-config.env에서 지도 파일과 그래프 경로를 지정하고, 기본 driving-car 대신 foot-walking 프로필을 활성화했다."},{type:"code",language:"yaml",caption:"ors-config.yml의 핵심 설정",code:`ors:
  engine:
    profile_default:
      enabled: false
      build:
        source_file: /home/ors/files/south-korea-latest.osm.pbf
      graph_path: /home/ors/graphs
    profiles:
      driving-car:
        enabled: false
      foot-walking:
        enabled: true`},{type:"code",language:"properties",caption:"ors-config.env의 같은 설정",code:`ors.engine.profile_default.build.source_file=/home/ors/files/south-korea-latest.osm.pbf
ors.engine.profile_default.graph_path=/home/ors/graphs
ors.engine.profiles.driving-car.enabled=false
ors.engine.profiles.foot-walking.enabled=true`},{type:"code",language:"bash",caption:"컨테이너 빌드와 상태 확인",code:`docker compose up --build -d
curl http://localhost:8080/ors/v2/health
# {"status":"ready"}`},{type:"paragraph",text:"로그에 지도 그래프 생성이 시작되었다는 문장과 애플리케이션 시작 메시지가 나타나고 health 응답이 ready이면 경로 계산을 요청할 수 있다."},{type:"code",language:"bash",caption:"두 좌표 사이의 도보 경로 요청",code:`curl -X POST "http://localhost:8080/ors/v2/directions/foot-walking" \\
  -H "Content-Type: application/json" \\
  -d '{
    "coordinates": [[127.02758, 37.49794], [127.02806, 37.49942]]
  }'`},{type:"code",language:"json",caption:"응답에서 사용하는 핵심 값",code:`{
  "routes": [{
    "summary": {
      "distance": 331.9,
      "duration": 239.0
    },
    "segments": [{ "steps": ["출발", "회전", "도착"] }]
  }]
}`},{type:"paragraph",text:"routes[0].summary의 distance는 경로 길이(미터), duration은 도보 소요 시간(초)이다. 응답에는 단계별 안내, 경로 geometry, bounding box와 사용한 엔진 정보도 함께 들어 있다."}]},{heading:"4. 50,670건의 역 접근 시간 계산",paragraphs:[],blocks:[{type:"paragraph",text:"입력 데이터는 2016~2020년 송도 아파트 거래와 2020~2025년 7월 7일 인천 서구 아파트 거래를 합친 50,670건이다. 도보 시간은 지하철 연장 사업의 영향을 받는 주택을 고르고 문화·교육·의료 시설 접근도 변수를 만드는 데 사용할 계획이었다."},{type:"paragraph",text:"신설 아라역의 영향을 보려면 주변 기존 역보다 아라역까지의 도보 시간이 짧은 주택을 찾아야 한다. 세 신설역을 둘러싼 인근 역을 비교 대상으로 두었다."},{type:"image",src:"/content/docker-openrouteservice-walking-time/figure-03.png",alt:"인천 서구의 세 신설역과 주변 지하철역 위치를 표시한 지도",caption:"신설역과 인근 기존 역을 함께 두고 각 주택의 최소 도보 시간을 비교했다."},{type:"image",src:"/content/docker-openrouteservice-walking-time/figure-04.png",alt:"아파트 좌표와 여러 지하철역 좌표를 연결해 도보시간을 계산하는 데이터 예시",caption:"주택마다 분석 대상 역과 인근 역까지의 경로를 계산한다."},{type:"paragraph",text:"50,670건에 10개 역을 모두 곱하면 50만 회가 넘는 요청이 필요하다. 송도 거래에는 송도달빛축제역만, 나머지 지역에는 9개 역만 요청하고 원본 파일을 여러 청크로 나누어 처리한 뒤 다시 합쳤다."},{type:"quote",text:"처음에는 약 1만 3천 번째 행부터 느려지는 현상을 메모리 문제로 보았다. 실제로는 파일 앞부분의 송도 거래는 한 번만 호출하지만 이후 서구 거래는 행마다 아홉 번 호출해 처리량이 급격히 늘어난 것이 원인이었다."},{type:"image",src:"/content/docker-openrouteservice-walking-time/figure-05.png",alt:"아파트 거래 파일을 여러 청크로 나누어 ORS 도보시간을 수집하는 진행 화면",caption:"split.py로 나누고 ors_walk.py로 계산한 뒤 결과 파일을 다시 통합했다."},{type:"list",items:["split.py: 원본 거래 파일을 apt_chunk_1.xlsx 같은 청크로 분할한다.","ors_walk.py: 각 청크의 좌표에서 역까지 ORS 도보 시간을 호출한다.","ors_walk_time: 계산이 끝난 청크를 하나의 파일로 통합한다."]},{type:"image",src:"/content/docker-openrouteservice-walking-time/figure-06.png",alt:"아파트 거래별로 송도달빛축제역과 서구 9개 역의 도보시간 열이 추가된 최종 데이터",caption:"pros_df_apartment_pricing_with_walk_time.xlsx에 역별 도보시간(초)을 저장했다."},{type:"paragraph",text:"송도 거래에는 송도달빛축제역 도보시간을, 그 밖의 지역에는 9개 역의 도보시간을 기록했다. 다음 단계에서는 분석 대상 신설역 3개가 가장 가까운 주택만 골라 분석 표본을 구성한다."}]}]},m={slug:"docker-openrouteservice-walking-time-part-2",section:"projects",title:"Docker 기반 OpenRouteService를 활용한 도보 소요 시간 계산(2)",summary:"역별 도보시간으로 연장 노선의 영향권 주택 3,248건을 선별하고, 학교·학원·유치원까지의 이동시간을 교육 접근도 변수로 만드는 과정을 정리합니다.",updatedAt:"2026-08-03",tools:["OpenRouteService","Python","Pandas","Folium"],status:"연재 2/4",dataset:"인천 아파트 실거래 50,670건",keywords:["관측값 필터링","교육 접근도","역세권","도보시간"],body:[{heading:"1. 관측값 필터링",paragraphs:[],blocks:[{type:"paragraph",text:"50,670건의 거래 내역에서 도보시간을 이용해 분석 대상 주택을 골랐다. 연수구 송도동과 인천 서구 전체 관측값 가운데 이 단계에서는 서구 지역을 필터링했다."},{type:"list",items:["인근 7개 역을 포함한 10개 역 가운데 연장 개통된 아라역·신검단중앙역·검단호수공원역의 도보시간이 최소인 주택","주택에서 역까지의 도보 소요시간이 1,800초 이내인 주택"]},{type:"quote",text:"30분 기준은 당시 탐색적으로 사용한 값이다. 최종 분석에서는 선행연구나 민감도 분석을 통해 10분·20분·30분 등 여러 기준을 비교할 필요가 있다."},{type:"paragraph",text:"어느 신설역이 가장 가까운지도 확인할 수 있도록 역 코드를 추가했다. 0은 아라역, 1은 신검단중앙역, 2는 검단호수공원역을 뜻한다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-2/figure-01.png",alt:"신설역 도보시간이 가장 짧고 30분 이내인 아파트 거래를 필터링한 코드와 결과",caption:"10개 역의 도보시간을 비교해 세 신설역 영향권에 해당하는 주택만 남겼다."},{type:"paragraph",text:"분류 결과는 Folium으로 지도에 표시해 공간적으로 확인했다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-2/figure-02.png",alt:"아라역 신검단중앙역 검단호수공원역과 필터링된 아파트를 표시한 Folium 지도",caption:"역 코드별 주택 분포를 지도 위에서 점검했다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-2/figure-03.png",alt:"역 코드별 필터링된 주택 거래 건수를 집계한 표 또는 그래프",caption:"아라역 코드가 전체 필터링 관측값의 약 85%를 차지했다."},{type:"paragraph",text:"50,670건 가운데 3,248건이 남았다. 아라역 인근 거래가 약 85%를 차지해 세 역을 각각 분리하면 일부 집단의 표본이 지나치게 작아진다고 판단했다. 이후 분석에서는 역 코드별로 쪼개지 않고 신설역 영향권이라는 하나의 집단으로 사용했다."}]},{heading:"2. 교육환경 접근도 변수 생성",paragraphs:[],blocks:[{type:"paragraph",text:"주택 가격은 주변 교육·의료·문화 환경의 영향을 받을 수 있다. 단순한 직선거리 대신 실제 보행 네트워크를 따른 이동시간으로 시설 접근도를 만들기 위해 먼저 교육환경을 계산했다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-2/figure-04.png",alt:"학교 학원 유치원 1,517건의 이름과 위도 경도를 담은 교육시설 데이터",caption:"학교·학원·유치원 총 1,517건의 좌표를 준비했다."},{type:"paragraph",text:"교육시설 좌표와 필터링한 주택 좌표를 매핑해 모든 주택-시설 조합의 도보 소요시간을 계산했다. 시설 유형마다 중요도가 다를 수 있어 세 집단으로 나누고, 같은 유형 안에서는 이동시간 구간별 시설 수를 집계했다."},{type:"list",items:["시설 집단 A: 학교","시설 집단 B: 학원","시설 집단 C: 유치원","시간 구간: 10분 이내, 10~20분, 20~30분"]},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-2/figure-05.png",alt:"주택별 학교 학원 유치원 도보시간을 10분 20분 30분 구간으로 집계한 접근도 데이터",caption:"시설 유형과 도보시간 구간을 결합해 교육 접근도 후보 변수를 만들었다."}]},{heading:"3. 다음 작업",paragraphs:[],blocks:[{type:"list",items:["학교·학원·유치원 사이의 가중치를 정할 근거를 선행연구에서 찾는다.","교육환경 접근도 계산을 마치고 의료·녹지 등 다른 생활환경 접근도로 확장한다.","거래가격을 설명하고 예측할 분석 모형을 관련 논문과 함께 비교한다."]},{type:"paragraph",text:"교육시설 1,517건과 주택 3,248건을 모두 조합하면 4,927,216회의 경로 계산이 필요하다. 이 글을 작성할 당시 약 절반을 처리했으며, 다음 세미나 전까지 의료와 문화 접근도를 추가하는 것을 목표로 두었다."}]}]},g={slug:"docker-openrouteservice-walking-time-part-3",section:"projects",title:"Docker 기반 OpenRouteService를 활용한 도보 소요 시간 계산(3)",summary:"의료·녹지·거시경제 데이터를 결합하고 거리감쇠와 개통시점 가중치로 접근도 파생변수를 만든 뒤, OLS와 TimesNet 분석용 데이터셋을 구성한 과정을 정리합니다.",updatedAt:"2026-08-03",tools:["OpenRouteService","Python","Statsmodels","TimesNet"],status:"연재 3/4",dataset:"인천 서구 아파트 거래·생활시설·거시경제 데이터",keywords:["의료 접근도","녹지 접근도","거리감쇠","TimesNet"],body:[{heading:"1. 의료·녹지 접근도 수집",paragraphs:[],blocks:[{type:"subheading",text:"의료 접근도"},{type:"paragraph",text:"병원과 약국을 합쳐 의료시설 822건을 만들었다. 시설 규모를 알 수 없는 약국은 규모 1로 두고, 병원은 확보한 규모 정보를 유지했다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-3/figure-01.png",alt:"병원과 약국 822건을 병합하고 약국 규모를 1로 지정한 의료시설 데이터",caption:"시설 유형과 규모, 위도·경도를 하나의 의료시설 표로 통합했다."},{type:"paragraph",text:"주택과 의료시설의 모든 조합에 대해 도보시간을 계산하고 10분·20분·30분 세 구간으로 나눴다. 각 구간 안의 의료시설 수가 아니라 시설 규모의 합을 집계해 접근도 후보를 만들었다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-3/figure-02.png",alt:"주택별 의료시설 도보시간과 규모를 세 구간으로 집계한 의료 접근도 결과",caption:"가까운 의료시설의 수와 규모를 함께 반영했다."},{type:"quote",text:"이 단계의 작업 기록에는 주택이 3,824건으로 적혀 있지만 앞 단계의 필터링 결과는 3,248건이다. 최종 재현 전 표본 정의와 행 수를 다시 확인해야 한다."},{type:"subheading",text:"녹지 접근도"},{type:"paragraph",text:"인천 서구의 공원과 주변 아파트를 매핑하고 공원 면적을 규모로 사용했다. 의료 접근도와 같은 세 시간 구간에서 공원 면적의 합을 집계했다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-3/figure-03.png",alt:"인천 서구 공원과 아파트를 매핑하고 도보시간 구간별 공원 면적을 집계한 데이터",caption:"녹지시설은 개수뿐 아니라 면적 규모를 가중치로 반영했다."}]},{heading:"2. 최종 데이터셋 구성",paragraphs:[],blocks:[{type:"list",items:["주택 속성: 건축연한, 계약날짜, 유명 브랜드 여부, 면적, 층","생활환경: 교통·의료·교육·녹지 접근도 16개","거시경제: KOSPI, GDP 성장률, 환율","반응변수: 아파트 거래가격"]},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-3/figure-04.png",alt:"주택 속성 교통 의료 교육 녹지 접근도 변수를 결합한 아파트 거래 데이터셋",caption:"공간 접근도와 개별 주택 속성을 거래 단위로 결합했다."},{type:"paragraph",text:"KOSPI와 환율은 계약일에 맞춰 연결하되 주말과 공휴일에는 직전 거래일 값을 사용했다. 당시 비어 있던 3분기 GDP 성장률 4건은 2분기 값을 사용해 보정했다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-3/figure-05.png",alt:"계약일별 KOSPI GDP 성장률 환율을 아파트 거래와 결합한 최종 데이터",caption:"주택·접근도·거시경제 변수를 하나의 분석표로 만들었다."}]},{heading:"3. 탐색적 분석과 OLS 기준선",paragraphs:[],blocks:[{type:"subheading",text:"기초 통계와 분포"},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-3/figure-06.png",alt:"최종 데이터셋 각 변수의 개수 평균 표준편차 분위수를 나타낸 기초 통계표",caption:"변수별 범위와 결측 여부를 먼저 점검했다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-3/figure-07.png",alt:"아파트 거래가격 반응변수의 분포를 나타낸 히스토그램",caption:"반응변수의 치우침과 극단값을 확인했다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-3/figure-08.png",alt:"주택 속성과 접근도 거시경제 예측변수 사이의 상관계수 히트맵",caption:"예측변수 사이의 강한 선형 관계를 시각적으로 확인했다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-3/figure-09.png",alt:"상관계수 절댓값이 0.7 이상인 예측변수 쌍을 정리한 표",caption:"학교·학원·유치원 접근도 사이에 특히 높은 상관이 나타났다."},{type:"list",items:["유치원·학교·학원 접근도의 결측 비율이 약 80%여서 수집과 집계 과정을 다시 확인할 필요가 있었다.","교육 접근도 변수끼리 상관이 매우 높아 그대로 함께 넣기보다 통합 파생변수를 고려했다."]},{type:"subheading",text:"다중선형회귀 기준선"},{type:"paragraph",text:"복잡한 모델과 비교할 기준선을 만들기 위해 OLS 다중선형회귀를 적합했다. 결정계수는 0.883이고 모형 전체 F 검정의 p-value는 0.001보다 작았다. 이는 표본 내 변동 설명력이 높고 모형 전체가 통계적으로 유의하다는 뜻이며, 별도의 검증 성능과는 구분해야 한다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-3/figure-10.png",alt:"아파트 거래가격에 대한 OLS 다중선형회귀의 결정계수와 F 통계량 요약",caption:"OLS를 이후 모델과 비교할 단순하고 해석 가능한 기준선으로 사용했다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-3/figure-11.png",alt:"OLS 회귀계수 표준오차 t 통계량 p-value를 나타낸 결과표",caption:"당시 모형에서는 네 변수를 제외한 계수가 통계적으로 유의하게 나타났다."}]},{heading:"4. 접근도 파생변수",paragraphs:[],blocks:[{type:"paragraph",text:"교통·녹지·의료·교육의 16개 구간 변수를 네 개의 부문별 접근도로 줄였다. 단순 합이 아니라 가까운 시설에 더 큰 점수를 주면서 근거와 재현성을 확보하는 가중치가 필요했다."},{type:"subheading",text:"교육·녹지·의료 접근도"},{type:"formula",latex:String.raw`w(d)=e^{-\alpha d}`,description:"거리가 멀어질수록 시설의 기여도를 지수적으로 줄이는 거리감쇠 함수"},{type:"paragraph",text:"도보시간 구간 A·B·C를 대표하는 거리 d에 거리감쇠함수를 적용했다. 감쇠계수 α는 0.01, 0.02, 0.05, 0.1, 0.2를 후보로 두고 통제변수를 포함한 5겹 교차검증 평균 결정계수가 가장 높은 값을 선택했다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-3/figure-12.png",alt:"거리감쇠 계수 후보별 교육 의료 녹지 접근도의 교차검증 결정계수 비교",caption:"후보 α마다 같은 교차검증 절차를 적용했다."},{type:"paragraph",text:"교육 접근도는 학교·학원·유치원 접근도를 먼저 각각 통합한 뒤 0.5, 0.3, 0.2의 가중치를 적용했다. 이 유형별 가중치 역시 최종 분석에서는 선행연구나 별도 검증 근거를 보강할 필요가 있다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-3/figure-13.png",alt:"거리감쇠와 학교 학원 유치원 가중치로 만든 교육 녹지 의료 접근도 결과",caption:"여러 시간 구간 변수를 부문별 접근도 한 개로 축약했다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-3/figure-14.png",alt:"네 개 파생 접근도와 주택 속성 거시경제 변수의 상관계수 히트맵",caption:"파생변수 생성 후 중복 정보가 줄었는지 다시 확인했다."},{type:"subheading",text:"교통 접근도와 개통 시점"},{type:"paragraph",text:"분석 기간은 2020년 11월 11일부터 2025년 7월 7일까지이고 신설역 개통일은 2025년 6월 28일이다. 같은 거리라도 개통 5년 전과 개통 후의 의미가 다르므로 개통일까지 남은 일수를 만들고 지수함수와 sigmoid 함수를 후보 가중치로 비교했다."},{type:"formula",latex:String.raw`s(t)=\frac{1}{1+e^{-\beta t}}`,description:"개통일을 기준으로 시간에 따른 교통 접근도의 작동 정도를 부드럽게 바꾸는 sigmoid 가중치"},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-3/figure-15.png",alt:"지수함수와 sigmoid 함수의 계수 후보별 교차검증 결정계수 비교",caption:"당시 비교에서는 sigmoid 함수와 β=0.1 조합이 가장 높은 값을 보였다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-3/figure-16.png",alt:"도보 기반 교통 접근도에 개통 시점 sigmoid 가중치를 곱한 파생변수",caption:"공간적 접근성과 정책 시행 시점을 하나의 변수에 함께 반영했다."},{type:"paragraph",text:"네 개 파생 접근도를 포함해 OLS를 다시 적합하고 계수와 모형 설명력을 확인했다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-3/figure-17.png",alt:"파생 접근도 네 개를 포함한 다중선형회귀 모형 요약",caption:"접근도 축약 후 모형 전체의 적합 결과를 확인했다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-3/figure-18.png",alt:"파생 접근도와 통제변수의 회귀계수 및 통계적 유의성 결과",caption:"각 접근도의 방향과 불확실성을 회귀계수 표로 검토했다."}]},{heading:"5. TimesNet 분석 준비",paragraphs:[],blocks:[{type:"paragraph",text:"최종 데이터셋을 TimesNet의 장기 시계열 예측 코드에 연결했다. 실행 경로는 run.py에서 시작해 exp/exp_long_term_forecasting.py와 models/TimesNet.py로 이어진다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-3/figure-19.png",alt:"TimesNet 저장소의 run.py exp models 디렉터리 구조",caption:"공개 TimesNet 구현을 기반으로 사용자 데이터 로더와 파라미터를 설정했다."},{type:"paragraph",text:"requirements.txt의 라이브러리 호환성을 맞추기 위해 Python 3.10 가상환경 .venv310을 별도로 만들었다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-3/figure-20.png",alt:"Python 3.10 가상환경에서 TimesNet 의존성을 설치한 터미널 화면",caption:"실험 환경을 분리해 라이브러리 버전 충돌을 줄였다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-3/figure-21.png",alt:"TimesNet run.py에서 사용할 수 있는 명령행 파라미터 목록",caption:"데이터 경로, 시퀀스 길이, 모델 차원과 학습 설정을 명령행에서 지정한다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-3/figure-22.png",alt:"사용자 아파트 거래 데이터로 TimesNet 학습을 실행한 터미널 명령",caption:"다변량 입력으로 거래가격 한 개를 예측하는 초기 실험 설정이다."},{type:"list",items:["작업: long_term_forecast, custom dataset, 다변량 features M","입력·예측 길이: seq_len 96, label_len 48, pred_len 24","차원: enc_in 12, dec_in 12, c_out 1, d_model 64, d_ff 64","TimesBlock: top_k 5, num_kernels 6, encoder layers 2","학습: epochs 10, batch 32, learning rate 0.001, patience 3"]},{type:"paragraph",text:"이 단계에서는 파라미터를 조정하며 적절한 값을 찾고 있었다. 다음 글에서는 TimesNet 결과를 단순 회귀와 자동 모델 비교 결과에 대조하고, 시계열 포맷 자체가 문제에 맞는지 다시 점검한다."}]}]},l={slug:"docker-openrouteservice-walking-time-part-4",section:"projects",title:"Docker 기반 OpenRouteService를 활용한 도보 소요 시간 계산(4)",summary:"TimesNet의 낮은 성능을 OLS·GBT와 비교해 진단하고, 불규칙한 아파트 거래 데이터의 시간축 문제를 확인한 뒤 역 개통 효과를 Event Study로 분석하는 방향을 정리합니다.",updatedAt:"2026-08-03",tools:["TimesNet","AI Studio","Statsmodels","Event Study"],status:"연재 4/4",dataset:"인천 서구 아파트 거래·접근도 시계열",keywords:["시계열 예측","TimesNet","GBT","Event Study"],body:[{heading:"1. TimesNet 성능 확인",paragraphs:[],blocks:[{type:"paragraph",text:"앞에서 만든 데이터셋을 TimesNet에 입력했다. 논문의 기본 모델 구조를 유지하되 입력 변수 수와 예측 대상 등 데이터 특성에 맞는 일부 파라미터만 바꿨다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-4/figure-01.png",alt:"TimesNet의 아파트 거래가격 실제값과 예측값을 시간 순서로 비교한 그래프",caption:"예측값은 실제 가격의 변화와 극단값을 충분히 따라가지 못했다."},{type:"code",language:"python",caption:"TimesNet 평가 함수가 반환한 다섯 지표",code:`array([
    1.3796588e+04,
    2.9077901e+08,
    1.7052244e+04,
    3.4556463e-01,
    2.5386664e-01
], dtype=float32)`},{type:"list",items:["MAE: 13,796만 원","MSE: 290,779,010","RMSE: 17,052만 원","MAPE: 약 0.346","MSPE: 약 0.254"]},{type:"paragraph",text:"같은 데이터에 다중선형회귀를 적합했을 때 두 변수 정도를 제외한 계수가 통계적으로 유의했고 결정계수는 0.878이었다. 결정계수와 TimesNet의 테스트 오차는 같은 척도가 아니므로 숫자만 직접 비교할 수는 없지만, 단순 기준선보다 복잡한 모델이 뚜렷한 이점을 보이지 않았다는 신호였다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-4/figure-02.png",alt:"아파트 거래가격 다중선형회귀의 결정계수와 회귀계수 유의성 결과",caption:"해석 가능한 선형모형을 기준선으로 두고 TimesNet 결과를 다시 점검했다."}]},{heading:"2. 낮은 성능의 원인 좁히기",paragraphs:[],blocks:[{type:"list",items:["접근도 변수 수집 과정에서 데이터 품질 문제가 있었는가?","TimesNet 입력 포맷과 전처리가 잘못되었는가?","거래 데이터의 불규칙한 시간 구조가 모델 가정과 맞지 않는가?"]},{type:"subheading",text:"2.1 AI Studio 자동 모델 비교"},{type:"paragraph",text:"Altair AI Studio의 Auto Model로 여섯 개 모델을 같은 데이터에서 빠르게 비교했다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-4/figure-03.png",alt:"Altair AI Studio Auto Model에 아파트 거래 데이터와 예측 대상을 설정한 화면",caption:"여러 회귀 모델을 동일한 분할과 지표로 비교했다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-4/figure-04.png",alt:"여섯 개 자동 회귀 모델의 RMSE와 성능 순위를 비교한 결과",caption:"트리 기반 GBT의 RMSE는 약 3,534로 TimesNet의 17,052보다 훨씬 낮았다."},{type:"paragraph",text:"GBT가 좋은 성능을 보였다는 사실은 접근도 데이터 자체가 어떤 모델에서도 쓸 수 없을 정도로 손상된 것은 아니라는 근거가 된다. 대신 현재 문제에는 표 형태의 비선형 관계를 다루는 트리 모델이 더 잘 맞거나, TimesNet에 입력한 시간축 구성이 부적절할 가능성이 커졌다."},{type:"subheading",text:"2.2 입력 전처리 점검"},{type:"paragraph",text:"사용한 TimesNet 데이터 로더는 내부 StandardScaler를 적용하므로 원본 수치형 값을 넣는다. 유명 브랜드 여부나 역 코드처럼 범주를 나타내는 숫자는 그대로 연속형 값으로 해석되지 않도록 사전에 더미변수 등으로 변환해야 한다. 다변량 입력은 모든 변수에 동일한 시간축을 사용해야 한다."},{type:"code",language:"python",caption:"TimesNet 데이터 로더의 내부 스케일러 초기화",code:`def __read_data__(self):
    self.scaler = StandardScaler()
    df_raw = pd.read_csv(
        os.path.join(self.root_path, self.data_path)
    )`},{type:"paragraph",text:"스케일링과 범주형 처리, 변수별 시간축을 점검했을 때 단순한 전처리 누락만으로 성능 저하를 설명하기는 어려웠다."}]},{heading:"3. 시계열 포맷과 거래 데이터의 불일치",paragraphs:[],blocks:[{type:"paragraph",text:"전통적인 시계열 분석에서는 평균·분산이 시간에 따라 안정적이고 공분산이 절대 시점보다 시차에 의존하는 정상성을 중요하게 본다. 딥러닝 모델이 항상 엄격한 정상성을 요구하는 것은 아니지만, 학습 구간의 패턴을 미래에 일반화하려면 추세·분산 변화·계절성과 시간 간격을 명시적으로 다뤄야 한다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-4/figure-05.png",alt:"아파트 거래 데이터의 날짜별 관측 분포와 중복·누락 시점을 확인한 시계열 그래프 또는 표",caption:"거래가 없는 날짜와 같은 날짜의 여러 거래가 함께 존재했다."},{type:"list",items:["모든 날짜에 관측값이 존재하지 않는다.","같은 날짜에 여러 아파트 거래가 발생한다.","행 하나를 한 시점으로 읽는 로더에서는 같은 날짜의 거래들이 서로 다른 연속 시점처럼 처리될 수 있다."]},{type:"paragraph",text:"누락된 날짜는 명시적인 시간 인덱스를 만든 뒤 결측값 처리나 보간을 검토할 수 있다. 같은 날짜의 여러 거래는 가격만 평균낼 것이 아니라 면적·층·단지·접근도 등 설명변수의 집계 기준을 함께 정해야 하므로 더 어렵다. 일별 집계 시계열, 단지별 패널 데이터, 또는 거래 단위의 표형 회귀 중 무엇을 분석 대상으로 삼을지 먼저 결정해야 한다."},{type:"quote",text:"TimesNet의 낮은 성능은 모델 자체보다 불규칙한 거래 행을 등간격 시계열로 간주한 문제에서 비롯되었을 가능성이 있다. 이는 추가 실험으로 검증해야 할 작업 가설이다."}]},{heading:"4. Event Study로 분석 방향 전환",paragraphs:[],blocks:[{type:"paragraph",text:"대안은 두 가지다. 하나는 GBT처럼 거래 단위 표형 데이터에 맞는 모델을 사용하는 것이고, 다른 하나는 지하철 연장 개통이라는 사건이 가격에 미친 영향을 직접 추정하는 것이다. 후자를 위해 Event Study 접근법을 검토했다."},{type:"paragraph",text:"FNGUIDE의 Event Study Manual은 배당, 증자, 합병, 이익공시 같은 사건이 주가에 미치는 영향을 사건 전후의 비정상 수익률로 평가한다. 전통적인 금융 이벤트 스터디에서는 사건에 영향을 받지 않은 추정기간으로 정상 기대수익률을 추정하고, 사건기간의 실제 수익률과 비교한다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-4/figure-06.png",alt:"추정기간과 사건일 전후 사건기간을 구분한 Event Study 시간축",caption:"추정기간에서 정상 상태를 추정하고 사건기간의 변화를 관찰한다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-4/figure-07.png",alt:"사건 이전 처리집단과 통제집단의 추세를 비교해 평행추세를 점검하는 그래프",caption:"정책 효과를 DiD형 Event Study로 해석할 때는 사건 전 계수로 사전 추세를 점검한다."},{type:"paragraph",text:"부동산 정책 효과 분석에서는 주택 속성·거시경제 변수와 시간 고정효과가 시장의 공통 움직임을 통제할 수 있다. 이 프로젝트가 알고 싶은 것은 개통일을 기준으로 역세권 주택과 통제 주택의 가격 경로가 어떻게 달라지는지다."},{type:"formula",latex:String.raw`Y_{it}=\alpha_i+\lambda_t+\sum_{k\ne-1}\beta_k\,\mathbf{1}(\text{event time}_{it}=k)+\gamma^\top X_{it}+\epsilon_{it}`,description:"주택 또는 지역 고정효과, 시점 고정효과와 통제변수를 포함해 개통 전후 상대시점별 효과를 추정하는 Event Study 회귀"},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-4/figure-08.png",alt:"신설역 개통일을 기준선으로 역세권 처리집단과 비역세권 통제집단을 구성한 분석 도식",caption:"도보 10분 등 접근시간 기준으로 처리집단을 정의하고 비교집단과 개통 전후 변화를 비교한다."},{type:"image",src:"/content/docker-openrouteservice-walking-time-part-4/figure-09.png",alt:"역 개통 전후 상대시점에 따른 아파트 가격 효과를 추정하기 위한 Event Study 데이터 구성",caption:"개통일을 event time 0으로 두고 각 거래의 상대시점을 계산한다."},{type:"list",items:["처리집단 정의: 신설역까지 도보 10분 등 사전에 정한 접근시간 안의 주택","통제집단 정의: 같은 시장권에 있으면서 신설역 영향권 밖에 있는 비교 가능한 주택","사전 검증: 개통 전 상대시점 계수와 표본 구성의 안정성 확인","강건성 분석: 10·20·30분 기준, 역별 표본, 다른 시간 창과 군집 표준오차 비교"]},{type:"paragraph",text:"다음 분석에서는 예측 정확도만 높이는 모델과 정책 효과를 설명하는 인과 추정 모형을 구분한다. 거래가격 예측에는 GBT 같은 표형 모델을, 개통 효과 해석에는 Event Study를 중심으로 설계를 구체화하는 방향이 적절하다."}]}]},$="/content/emergency-martial-law-news-text-mining",c={slug:"emergency-martial-law-news-text-mining",section:"projects",title:"2024년 12월 비상계엄 관련 YouTube 뉴스 제목 텍스트 마이닝",summary:"2024년 12월 3일부터 29일까지 9개 방송사의 YouTube 뉴스 제목을 수집해 단어 빈도, 공기어 네트워크, 사전 기반 감성지수의 주차별 차이를 탐색한 프로젝트입니다.",updatedAt:"2026-08-03",publishedYear:2025,status:"분석 완료",dataset:"2024-12-03~2024-12-29 YouTube 뉴스 제목, 9개 방송사",tools:["Python","YouTube Data API v3","Kiwi","WordCloud","NetworkX","Gephi","KNU 감성어 사전"],keywords:["텍스트 마이닝","뉴스 제목","단어 빈도","공기어 네트워크","감성 분석","YouTube Data API"],body:[{heading:"프로젝트 개요",paragraphs:[],blocks:[{type:"paragraph",text:"연구 주제를 고를 때는 흥미뿐 아니라 비슷한 연구가 있는지, 현재 가진 자료와 방법으로 질문에 답할 수 있는지를 함께 살펴보려고 한다. 이 프로젝트는 2024년 12월 3일 비상계엄 선포 이후 한 달 동안 9개 방송사가 YouTube에 올린 뉴스 영상의 제목을 비교한다."},{type:"quote",text:"이 글에서 비교하는 것은 제목에 나타난 탐색적 어휘·표현 차이다. 단어 빈도나 감성지수만으로 방송사의 정치적 성향, 보도 의도 또는 여론에 대한 인과효과를 단정하지 않는다."},{type:"list",items:["분석 단위: YouTube 뉴스 영상 제목","수집 기간: 2024년 12월 3일~12월 29일","분석 대상: YTN, JTBC News, KBS News, MBCNEWS, MBN News, SBS 뉴스, 뉴스TVCHOSUN, 연합뉴스TV, 채널A News","분석 방법: 단어 빈도와 WordCloud, 제목 단위 공기어 네트워크, KNU 감성어 사전 기반 감성지수"]}]},{heading:"1. 서론",paragraphs:[],blocks:[{type:"subheading",text:"1.1 연구 배경"},{type:"paragraph",text:"언론 보도는 사건을 전달할 뿐 아니라 어떤 인물과 행위를 어떤 단어로 묘사할지 선택한다. 종이신문과 방송 중심의 환경이 언제든 콘텐츠를 소비할 수 있는 온라인 플랫폼으로 확장되면서, 동일한 사건이 채널마다 어떤 제목으로 제시되는지 비교할 수 있는 자료도 늘어났다."},{type:"paragraph",text:"기존 연구에서는 주관적 표현, 유도적 해석, 표현의 신중성 같은 언론 보도 문제를 다루어 왔다. 여기서는 대표적인 온라인 동영상 플랫폼인 YouTube를 대상으로 한 달간의 제목을 수집하고, 방송사와 시기에 따라 사용 어휘와 공기 패턴, 사전 기반 감성점수가 어떻게 달라지는지 탐색한다."},{type:"subheading",text:"1.2 연구 질문"},{type:"list",ordered:!0,items:["동일한 사건을 보도할 때 제목의 단어 선택이 방송사별로 다르게 나타나는가?","제목의 주요 단어와 연결 관계는 사건이 전개되는 주차에 따라 어떻게 달라지는가?","사전 기반 감성지수는 방송사와 주차에 따라 어떤 분포를 보이는가?"]},{type:"paragraph",text:"초기 질문에는 제목의 차이와 여론의 연관성도 포함했지만, 약 4주 분량의 기술통계와 여론조사 요약만으로는 그 관계를 검정하거나 인과를 말할 수 없다. 따라서 이 글에서는 여론 자료를 사건 맥락을 이해하기 위한 참고 정보로만 사용한다."},{type:"subheading",text:"1.3 분석 절차"},{type:"list",items:["YouTube Data API로 채널별 업로드 제목과 시각 수집","Kiwi 형태소 분석과 사용자 불용어 처리","방송사·주차별 상위 빈도 단어와 WordCloud 확인","한 제목 안에서 함께 등장한 단어의 공기어 네트워크 구성","KNU 감성어 사전으로 탐색적 감성점수 계산"]}]},{heading:"2. 데이터 수집",paragraphs:[],blocks:[{type:"subheading",text:"2.1 YouTube Data API v3"},{type:"paragraph",text:"영상 제목, 채널명, 게시 시각은 YouTube Data API v3로 수집했다. API에는 하루 10,000 quota units가 제공되고 호출 종류마다 비용이 다르므로, 수집 요청 수와 페이지네이션을 함께 관리해야 한다. quota는 토큰이 아니라 요청별로 차감되는 API 사용 단위다."},{type:"image",src:`${$}/figure-01.png`,alt:"YouTube Data API 일일 쿼터를 초과했을 때 표시된 오류 메시지",caption:"YouTube Data API의 일일 quota units를 모두 사용했을 때 발생한 오류"},{type:"subheading",text:"2.2 채널·기간·페이지네이션"},{type:"paragraph",text:"수집 대상은 방송사를 운영하며 구독자 수가 많은 9개 뉴스 채널로 한정했다. 이 선택은 국내 전체 언론을 대표하는 확률표본이 아니며, YouTube에 게시된 제목만 다룬다. 게시 시각은 UTC로 받은 뒤 한국 표준시 기준 경계를 확인해야 한다."},{type:"code",language:"python",caption:"채널별 업로드를 페이지 끝까지 순회해 제목과 게시 시각을 모으는 핵심 구조",code:String.raw`from googleapiclient.discovery import build
import pandas as pd

youtube = build("youtube", "v3", developerKey=API_KEY)

def collect_titles(channel_id, published_after, published_before):
    rows = []
    page_token = None
    while True:
        response = youtube.search().list(
            channelId=channel_id,
            part="id,snippet",
            type="video",
            order="date",
            publishedAfter=published_after,
            publishedBefore=published_before,
            maxResults=50,
            pageToken=page_token,
        ).execute()

        for item in response.get("items", []):
            rows.append({
                "Channel_ID": channel_id,
                "Channel_Name": item["snippet"]["channelTitle"],
                "Upload_Date": item["snippet"]["publishTime"],
                "Video_Title": item["snippet"]["title"],
                "Video_ID": item["id"]["videoId"],
            })

        page_token = response.get("nextPageToken")
        if not page_token:
            break
    return pd.DataFrame(rows)`},{type:"paragraph",text:"원래 실험은 quota를 고려해 약 4시간 단위로 나누어 CSV를 저장한 뒤 합쳤다. 다만 search.list는 한 요청에서 최대 50개만 돌려주므로 nextPageToken을 순회하지 않으면 업로드가 많은 구간이 누락된다. 재현 시에는 업로드 재생목록을 페이지 끝까지 읽거나 위와 같이 페이지네이션하고, Video_ID 기준 중복 제거와 삭제·비공개 영상 처리 기록도 남겨야 한다."},{type:"list",items:["정정한 수집 기간: 2024-12-03~2024-12-29","날짜 구간은 종료일 자정 누락을 피하도록 반개구간으로 처리","원자료 필드: 채널 ID, 채널명, 업로드 시각, 영상 제목, 영상 ID","필수 품질 점검: 페이지 누락, 중복 Video_ID, 주차·방송사별 표본 수"]}]},{heading:"3. 데이터 전처리",paragraphs:[],blocks:[{type:"subheading",text:"3.1 데이터 형식과 주차 구간"},{type:"paragraph",text:"통합 CSV를 불러온 뒤 Upload_Date를 시간대가 있는 datetime으로 변환하고 방송사별 제목 목록을 만들었다. 예를 들어 첫 구간을 12월 3일부터 8일까지로 정의하려면 종료 시각을 12월 8일 00:00으로 두지 말고 다음 날보다 작은 값으로 비교해야 8일의 나머지 시간이 빠지지 않는다."},{type:"image",src:`${$}/figure-02.png`,alt:"YTN 채널에서 수집한 YouTube 뉴스 영상 제목 목록의 출력 결과",caption:"방송사별로 분리한 영상 제목 예시"},{type:"subheading",text:"3.2 형태소 분석과 명사 추출"},{type:"paragraph",text:"특수기호를 정리한 뒤 Kiwi로 토큰화하고 일반명사·고유명사·의존명사를 추출했다. 기본 불용어와 분석 목적에 맞춘 사용자 불용어를 제거했다. 방송사 전체 제목을 합친 목록은 빈도·WordCloud에, 제목별 토큰 목록은 같은 제목 안의 공기 관계를 계산하는 데 사용했다."},{type:"code",language:"python",caption:"빈도 분석용 토큰과 제목 단위 네트워크용 토큰을 함께 만드는 전처리 예시",code:String.raw`import re
from kiwipiepy import Kiwi
from kiwipiepy.utils import Stopwords

kiwi = Kiwi()
stopwords = Stopwords()
NOUN_TAGS = {"NNG", "NNP", "NNB"}

def tokenize_title(title, custom_stopwords):
    cleaned = re.sub(r"[^\s\w\d]", " ", title)
    tokens = kiwi.tokenize(cleaned, stopwords=stopwords)
    return [
        token.form for token in tokens
        if token.tag in NOUN_TAGS and token.form not in custom_stopwords
    ]

tokens_by_title = [tokenize_title(title, CUSTOM_STOPWORDS) for title in titles]
tokens_for_frequency = [word for title in tokens_by_title for word in title]`},{type:"image",src:`${$}/figure-03.png`,alt:"YTN 뉴스 제목을 형태소 분석한 뒤 명사와 불용어를 정리한 출력",caption:"빈도 분석을 위해 방송사 단위로 합친 전처리 결과"},{type:"image",src:`${$}/figure-04.png`,alt:"각 뉴스 제목을 독립된 명사 토큰 목록으로 전처리한 출력",caption:"공기어 네트워크를 위해 제목 경계를 유지한 전처리 결과"},{type:"paragraph",text:"사용자 불용어 목록은 결과에 직접 영향을 주므로 공개하고, 불용어를 바꾸었을 때 핵심 결과가 유지되는지 확인해야 한다. 또한 명사만 남기는 선택은 WordCloud에는 편리하지만 감성 분석에서는 형용사·동사·부정 표현을 잃는다는 한계가 있다."}]},{heading:"4. 데이터 분석 방법",paragraphs:[],blocks:[{type:"subheading",text:"4.1 단어 빈도와 WordCloud"},{type:"paragraph",text:"방송사별 명사 빈도를 세고 상위 15개를 추출했다. WordCloud는 많이 등장한 단어를 크게 보여 주어 한 주의 중심 어휘를 빠르게 확인하는 보조 시각화다. 채널마다 업로드 수가 다르므로, 방송사 간 비교에는 절대 횟수와 함께 전체 토큰 수로 나눈 상대 빈도를 사용해야 한다."},{type:"image",src:`${$}/figure-05.png`,alt:"YTN 뉴스 제목에서 자주 등장한 탄핵 대통령 계엄 등의 단어를 크기로 표시한 WordCloud",caption:"YTN 제목의 단어 빈도를 표현한 WordCloud 예시"},{type:"image",src:`${$}/figure-06.png`,alt:"YTN 뉴스 제목에서 가장 자주 등장한 명사 15개의 목록",caption:"공기어 네트워크 후보로 사용한 빈도 상위 15개 단어"},{type:"subheading",text:"4.2 제목 단위 공기어 네트워크"},{type:"paragraph",text:"한 제목에 함께 등장한 상위 단어를 이진 문서-단어 행렬로 바꾸고 전치행렬을 곱해 공기 횟수를 구했다. 노드는 단어, 엣지 가중치는 같은 제목에서 함께 나온 횟수다. 이는 의미적 유사성이나 인과관계가 아니라 제목 단위의 동시 출현 관계다."},{type:"code",language:"python",caption:"제목-단어 행렬에서 공기어 네트워크를 만드는 핵심 코드",code:String.raw`import numpy as np
import networkx as nx
from sklearn.feature_extraction.text import CountVectorizer

def construct_network(tokenized_titles, vocabulary):
    sentences = [" ".join(word for word in title if word in vocabulary)
                 for title in tokenized_titles]
    sentences = [sentence for sentence in sentences if len(sentence.split()) > 1]

    vectorizer = CountVectorizer(
        vocabulary=sorted(vocabulary),
        binary=True,
        token_pattern=r"(?u)\\b\\w+\\b",
    )
    document_term = vectorizer.fit_transform(sentences)
    cooccurrence = (document_term.T @ document_term).toarray()
    np.fill_diagonal(cooccurrence, 0)

    graph = nx.from_numpy_array(cooccurrence)
    names = vectorizer.get_feature_names_out()
    return nx.relabel_nodes(graph, dict(enumerate(names)))`},{type:"image",src:`${$}/figure-07.png`,alt:"채널A 뉴스 제목에서 추출한 단어 노드와 공기 엣지의 NetworkX 그래프",caption:"NetworkX로 먼저 확인한 채널A의 제목 공기어 네트워크"},{type:"image",src:`${$}/figure-08.png`,alt:"SBS 뉴스 제목의 대통령 탄핵 국회 등의 단어 관계를 시각화한 Gephi 네트워크",caption:"Gephi로 다듬은 SBS 제목 공기어 네트워크 예시"},{type:"paragraph",text:"그래프는 GraphML로 저장한 뒤 Gephi에서 배치와 크기를 조정했다. 노드 크기를 빈도 또는 연결중심성 중 무엇으로 정했는지, 엣지 두께가 공기 횟수인지 정규화된 연관도인지 명시해야 방송사별 그림을 비교할 수 있다."},{type:"subheading",text:"4.3 KNU 감성어 사전 기반 감성지수"},{type:"paragraph",text:"정치 기사 제목에 대한 정답 라벨이 없어 지도학습 분류기 대신 KNU 감성어 사전의 극성 점수(-2~+2)를 사용했다. 감성지수의 구성은 대통령 관련 보도의 감성지수를 다룬 선행연구를 참고했다."},{type:"image",src:`${$}/figure-09.png`,alt:"대통령 관련 보도의 감성지수와 정파성 관계를 다룬 선행연구 참고 화면",caption:"감성지수 정의를 검토할 때 참고한 선행연구"},{type:"image",src:`${$}/figure-10.png`,alt:"긍정과 부정 감성 점수 합을 전체 단어 수로 정규화한 감성지수 식",caption:"방송사별 제목을 비교하기 위해 사용한 감성지수의 정의"},{type:"paragraph",text:"이 구현에서 감성지수는 선택된 단어의 KNU 극성 점수 합을 전체 단어 수로 나눈 값이다. 따라서 값이 더 음수일수록 사전상 부정적인 어휘점수가 크고, 값이 더 양수일수록 긍정적인 어휘점수가 크다. 0에 가깝다는 사실만으로 문장이 중립이라고 단정할 수는 없다."},{type:"image",src:`${$}/figure-11.png`,alt:"분석 키워드가 포함된 뉴스 제목만 방송사별로 추린 토큰 목록",caption:"감성점수를 계산하기 전에 키워드 포함 여부로 선별한 제목 예시"},{type:"code",language:"python",caption:"0으로 나누는 경우와 감성사전 적중률을 함께 처리한 감성지수 예시",code:String.raw`def sentiment_summary(tokenized_titles, lexicon):
    words = [word for title in tokenized_titles for word in title]
    matched_scores = [lexicon[word] for word in words if word in lexicon]

    total_words = len(words)
    matched_words = len(matched_scores)
    score_sum = sum(matched_scores)

    return {
        "sentiment_index": score_sum / total_words if total_words else None,
        "matched_token_index": score_sum / matched_words if matched_words else None,
        "lexicon_coverage": matched_words / total_words if total_words else 0.0,
        "total_words": total_words,
        "matched_words": matched_words,
    }`},{type:"image",src:`${$}/figure-12.png`,alt:"KNU 감성어 사전을 적용해 방송사별 감성지수를 계산한 출력값",caption:"방송사별 보도 제목에서 계산한 감성지수의 초기 출력"},{type:"paragraph",text:"서로 다른 상위 키워드로 각 방송사의 제목을 먼저 거르면 비교 대상 자체가 달라질 수 있다. 최종 비교에서는 공통 사건 키워드를 사용하거나 전체 제목을 분석하고, 방송사별 전체 단어 수·사전 적중 단어 수·적중률을 함께 제시하는 편이 안전하다."}]},{heading:"5. 분석 결과",paragraphs:[],blocks:[{type:"paragraph",text:"결과는 방송사별 상위 15개 단어, WordCloud, 제목 공기어 네트워크, 감성지수 순서로 살펴봤다. 먼저 한국갤럽이 정리한 대통령 직무 수행평가와 주요 정치 이슈를 사건의 시간적 맥락을 확인하는 참고자료로 두었다. 이 자료와 제목 지표 사이의 인과관계는 분석하지 않았다."},{type:"image",src:`${$}/figure-13.png`,alt:"2024년 12월 전후 대통령 직무 수행평가와 주요 정치 이슈를 주차별로 정리한 한국갤럽 자료",caption:"분석 기간의 사건 흐름을 확인하기 위한 한국갤럽 참고자료"},{type:"subheading",text:"5.1 12월 1주차"},{type:"paragraph",text:"첫 주에는 ‘대통령’, ‘탄핵’, ‘계엄’, ‘윤’이 공통적인 중심 단어였고 ‘국민의힘’, ‘한동훈’, ‘국회’, ‘표결’도 여러 채널에서 나타났다. 상대적으로 눈에 띈 표현으로는 YTN의 ‘내란죄’, MBC의 ‘윤석열’·‘내란’·‘퇴진’, TV조선의 ‘이재명’ 등이 있었다."},{type:"image",src:`${$}/figure-14.png`,alt:"12월 1주차 9개 방송사 뉴스 제목의 빈도 상위 15개 단어 비교표",caption:"12월 1주차 방송사별 빈도 상위 단어"},{type:"image",src:`${$}/figure-15.png`,alt:"12월 1주차 9개 방송사 뉴스 제목의 단어 빈도 WordCloud 모음",caption:"12월 1주차 방송사별 WordCloud"},{type:"image",src:`${$}/figure-16.png`,alt:"12월 1주차 9개 방송사 뉴스 제목의 공기어 네트워크 모음",caption:"12월 1주차 방송사별 제목 공기어 네트워크"},{type:"paragraph",text:"공기어 네트워크에서는 YTN의 ‘대통령-내란죄’, ‘내란죄-수사’, MBC의 ‘대통령-내란-퇴진-탄핵’과 ‘윤석열-퇴진’, TV조선의 ‘한동훈-이재명’ 연결이 관찰됐다. 이는 해당 제목 안에서 단어가 함께 등장했다는 뜻이며, 보도 태도나 의도를 직접 증명하지는 않는다."},{type:"subheading",text:"5.2 12월 2주차"},{type:"paragraph",text:"둘째 주에도 ‘대통령’, ‘윤’, ‘계엄’, ‘탄핵’, ‘한동훈’, ‘국민의힘’이 중심이었고 ‘김용현’, ‘구속’, ‘수사’가 새롭게 두드러졌다. ‘내란’은 첫 주에 눈에 띈 MBC와 YTN뿐 아니라 JTBC, MBN, TV조선, 채널A의 상위 어휘에서도 더 자주 확인됐다. KBS, SBS, 연합뉴스TV에서는 상대적으로 덜 나타났다."},{type:"image",src:`${$}/figure-17.png`,alt:"12월 2주차 9개 방송사 뉴스 제목의 빈도 상위 15개 단어 비교표",caption:"12월 2주차 방송사별 빈도 상위 단어"},{type:"image",src:`${$}/figure-18.png`,alt:"12월 2주차 9개 방송사 뉴스 제목의 단어 빈도 WordCloud 모음",caption:"12월 2주차 방송사별 WordCloud"},{type:"image",src:`${$}/figure-19.png`,alt:"12월 2주차 9개 방송사 뉴스 제목의 공기어 네트워크 모음",caption:"12월 2주차 방송사별 제목 공기어 네트워크"},{type:"paragraph",text:"네트워크에서 ‘내란’은 ‘대통령’, ‘윤석열’ 등 사건 당사자와 함께 등장했다. 첫 주와 비교하면 사건 규정과 수사 절차를 나타내는 어휘가 여러 채널로 확산된 흐름으로 읽을 수 있다."},{type:"subheading",text:"5.3 12월 3주차"},{type:"paragraph",text:"셋째 주에는 기존의 ‘대통령’, ‘윤’, ‘계엄’, ‘탄핵’에 ‘출석’, ‘헌재’, ‘권성동’, ‘거부’가 더해졌다. 보도 제목의 초점이 선포 직후의 상황에서 탄핵 절차와 헌법기관, 정치권 대응으로 이동하는 양상이 나타났다."},{type:"image",src:`${$}/figure-20.png`,alt:"12월 3주차 9개 방송사 뉴스 제목의 빈도 상위 15개 단어 비교표",caption:"12월 3주차 방송사별 빈도 상위 단어"},{type:"image",src:`${$}/figure-21.png`,alt:"12월 3주차 9개 방송사 뉴스 제목의 단어 빈도 WordCloud 모음",caption:"12월 3주차 방송사별 WordCloud"},{type:"image",src:`${$}/figure-22.png`,alt:"12월 3주차 9개 방송사 뉴스 제목의 공기어 네트워크 모음",caption:"12월 3주차 방송사별 제목 공기어 네트워크"},{type:"subheading",text:"5.4 12월 4주차"},{type:"paragraph",text:"넷째 주에는 ‘대통령’, ‘윤’, ‘탄핵’과 함께 ‘공수처’, ‘헌재’, ‘재판관’, ‘노상원’, ‘한덕수’ 등이 상위 어휘로 나타났다. 수사기관, 헌법재판 절차, 권한대행과 관련된 후속 보도가 제목 구성에 반영된 것으로 볼 수 있다."},{type:"image",src:`${$}/figure-23.png`,alt:"12월 4주차 9개 방송사 뉴스 제목의 빈도 상위 15개 단어 비교표",caption:"12월 4주차 방송사별 빈도 상위 단어"},{type:"quote",text:"원문 이미지 링크가 만료되어 12월 4주차 두 번째 시각화는 보존하지 못했다. 확인되지 않은 이미지를 임의로 재구성하지 않고 누락 사실을 기록한다."},{type:"image",src:`${$}/figure-24.png`,alt:"12월 4주차 9개 방송사 뉴스 제목의 공기어 네트워크 모음",caption:"12월 4주차 방송사별 제목 공기어 네트워크"},{type:"subheading",text:"5.5 감성지수"},{type:"paragraph",text:"주차별 표는 방송사별 KNU 극성 점수 합, 전체 단어 수, 감성지수를 정리한다. 12월 4주차 채널A의 0.00447을 제외하면 표시된 감성지수는 모두 음수였다. 다만 ‘탄핵’이라는 사건 주제 때문에 당연한 결과라고 단정하기보다는 감성사전 적중 단어와 문맥을 함께 확인해야 한다."},{type:"image",src:`${$}/figure-25.png`,alt:"주차와 방송사별 긍정 부정 점수 합 총 단어 수 감성지수를 정리한 표",caption:"주차별 방송사 감성지수 계산 결과"},{type:"image",src:`${$}/figure-26.png`,alt:"12월 각 주차의 방송사별 감성지수 분포와 평균 차이를 비교한 그래프",caption:"주차별 방송사 감성지수 분포"},{type:"paragraph",text:"첫 주는 지수 평균이 상대적으로 낮고 방송사 간 산포가 작았으며, 이후 주차에는 평균과 산포가 변했다. 셋째 주의 MBC -0.03155는 YTN -0.00212보다 더 낮고 더 음수이므로, 이 지표에서는 MBC 쪽의 부정적 어휘점수가 더 컸다고 읽어야 한다. 넷째 주의 JTBC -0.02375도 채널A 0.00447보다 더 부정적인 방향이다. 이 수치만으로 부정 단어의 ‘개수’, 보도 대상에 대한 평가, 정치 성향을 동일시할 수는 없다."},{type:"image",src:`${$}/figure-27.png`,alt:"9개 방송사의 12월 평균 감성지수와 전체 평균선을 함께 나타낸 그래프",caption:"방송사별 12월 평균 감성지수와 전체 평균"},{type:"paragraph",text:"월평균 그래프에서도 방송사 사이의 값 차이가 관찰되고 KBS는 전체 평균 부근에 위치했다. 그래프를 읽을 때는 더 음수인 값이 사전상 더 부정적인 방향이라는 기준을 유지해야 한다. 평균선 위아래의 위치는 탐색적 차이일 뿐, 편향의 증거나 인과적 효과가 아니다."}]},{heading:"6. 결론",paragraphs:[],blocks:[{type:"paragraph",text:"한 달의 제목을 주차별로 나누어 보니 ‘대통령’, ‘계엄’, ‘탄핵’이라는 공통 축은 유지되면서 ‘내란’, ‘수사’, ‘헌재’, ‘공수처’, ‘재판관’, ‘한덕수’처럼 사건 단계에 따른 어휘가 차례로 부각됐다. 공기어 네트워크는 이 단어들이 한 제목 안에서 어떤 인물·기관·절차와 함께 사용됐는지를 보여 주었다."},{type:"paragraph",text:"방송사별로 상위 어휘와 감성지수의 차이도 관찰됐다. 그러나 현재 자료와 방법이 보여 주는 범위는 YouTube 제목의 어휘 구성과 사전 기반 점수 차이까지다. 기사 본문, 영상 내용, 인용 주체, 제목 작성 의도까지 확인하지 않은 상태에서 정치적 편향이나 시민 여론에 미친 영향을 결론으로 확장해서는 안 된다."}]},{heading:"7. 해석의 한계와 다음 분석",paragraphs:[],blocks:[{type:"list",items:["표본 대표성: 9개 YouTube 뉴스 채널의 제목만 포함하므로 전체 언론 보도를 대표하지 않는다.","수집 완전성: API quota와 maxResults 제한 때문에 페이지네이션·중복 제거·누락 검사가 필요하다.","표본수 차이: 방송사별 업로드 수와 제목 길이가 달라 절대 빈도와 감성점수를 그대로 비교하면 안 된다.","사전 적중률: KNU 사전에 없는 단어가 많을수록 지수가 0에 가까워질 수 있으므로 채널별 적중률을 함께 보고해야 한다.","명사 중심 분석: 형용사, 동사, 부정어, 인용과 감성의 대상을 잃어 문장 맥락을 충분히 반영하지 못한다.","키워드 선별 효과: 방송사마다 다른 상위 단어로 제목을 거르면 감성지수의 비교 모집단이 달라진다.","네트워크 해석: 엣지는 한 제목 안의 동시 출현 횟수이며 의미적 연관이나 인과관계를 뜻하지 않는다.","여론과의 관계: 4주 기술통계와 여론조사 추이만으로 방향이나 인과를 판단할 수 없다."]},{type:"paragraph",text:"다음 분석에서는 방송사·주차별 제목 수와 토큰 수를 먼저 공개하고, 전체 제목을 공통 기준으로 정규화해야 한다. 감성사전 적중률과 사전 적중 토큰 기준 지수를 병기하고, 사람이 표본 제목을 직접 코딩해 사전 점수의 타당도를 점검할 수 있다. 기사 본문과 발화 주체까지 확장한다면 대상 기반 감성 분석과 프레임 분석도 가능하다."},{type:"quote",text:"이 프로젝트의 결과는 확정적 판정이 아니라 후속 질문을 만들기 위한 탐색적 기록이다. 재현 가능한 수집 기준과 비교 가능한 분모를 갖추는 일이 더 정교한 해석보다 먼저다."}]}]},_="2026-08-04",d="조선왕조실록 347,491건";function h(a){return a.flatMap(({label:a,entry:t},e)=>t.body.map((t,r)=>({...t,heading:`${e+1}.${r+1} ${a} — ${t.heading.replace(/^\d+(?:\.\d+)*\.\s*/,"")}`})))}let u=["데이터 수집","추론 환경","MySQL 저장","전처리·임베딩","검색·컨텍스트","API 처리 계층","결과 UI","평가·개선"],b=([...h([{slug:"joseon-annals-rag-data-collection",section:"projects",title:"조선왕조실록 정책·심리 추론 RAG(1) - 데이터 수집",summary:"한국고전종합DB에서 조선왕조실록 347,491건을 수집하고 왕·즉위연차·날짜·사건번호를 일관된 메타데이터로 구성한 과정을 정리합니다.",updatedAt:_,tools:["Python","Requests","BeautifulSoup"],status:"완료",dataset:d,keywords:["조선왕조실록","웹 수집","메타데이터","디지털 인문학"],body:[{heading:"프로젝트 범위",paragraphs:[],blocks:[{type:"paragraph",text:"조선왕조실록 원문을 검색 근거로 사용해 왕의 정책 결정 방식과 판단 맥락을 살펴보는 RAG 프로젝트다. 결론을 성격처럼 단정하기보다, 답변마다 관련 원문과 메타데이터를 함께 제시하는 것을 기준으로 잡았다."},{type:"table",caption:"수집 범위",headers:["항목","내용"],rows:[["출처","한국고전종합DB"],["기간","1392년(태조 1)~1863년(철종 14), 472년"],["규모","347,491행, 약 356MB"],["수집 단위","왕 · 즉위연차 · 월 · 일 · 사건번호"],["원문 단위","실록의 개별 사건 기록"]]}]},{heading:"메타데이터 구조",paragraphs:[],blocks:[{type:"table",caption:"원문 레코드 스키마",headers:["필드","형식","역할"],rows:[["king_code","문자열","왕을 구분하는 코드"],["reign_year","문자열","즉위 기준 연차"],["month","문자열","음력 월과 윤달 구분"],["day","문자열","일자"],["event_no","정수","같은 날짜 안의 사건 순서"],["content","본문","조선왕조실록 원문"]]},{type:"paragraph",text:"메타데이터는 검색 결과를 출처로 되돌리는 기준이 된다. 예를 들어 왕 코드와 즉위연차를 먼저 제한하면, 의미가 비슷하지만 다른 왕의 기록이 근거에 섞이는 문제를 줄일 수 있다."}]},{heading:"수집 규칙",paragraphs:[],blocks:[{type:"list",items:["요청 사이에 지연을 두고 차단과 네트워크 오류를 예외 처리한다.","HTML 문서에서 사건 본문만 추출하고 공백과 줄바꿈을 정리한다.","즉위 0~1년은 1월 1일부터 12월 31일까지 확인해 연초 기록 누락을 막는다.","이후 연차는 월별 결과를 확인하며 다음 왕으로 넘어가는 종료 조건을 둔다.","윤달은 일반 월과 다른 코드로 보존해 날짜 의미가 사라지지 않게 한다.","수집 결과는 CSV로 합치고 복합 키를 기준으로 중복을 제거한다."]}]},{heading:"전체 파이프라인",paragraphs:[],blocks:[{type:"list",ordered:!0,items:["실록 원문 수집과 MySQL 적재","본문 정제와 사건 단위 parent 청크 생성","긴 사건의 sub 청크 분리","parent 임베딩과 FAISS 인덱스 생성","질문에서 왕·연차·정책 단서 추출","parent 검색과 sub 재정렬","근거 문맥 구성과 로컬 LLM 추론","답변과 원문 근거를 React 화면에 함께 표시","검색 품질 평가와 키워드·군집 기반 개선"]}]}]},{slug:"joseon-annals-rag-inference",section:"projects",title:"조선왕조실록 정책·심리 추론 RAG(2) - 추론 환경",summary:"Qwen 2.5 14B Instruct를 vLLM과 runtime INT8 구성으로 로컬에서 실행하고, 검색·API 계층과 분리한 추론 환경을 정리합니다.",updatedAt:_,tools:["vLLM","Qwen 2.5","CUDA","PyTorch"],status:"완료",dataset:d,architecture:"Qwen 2.5-14B-Instruct · vLLM",keywords:["로컬 LLM","INT8","추론 서버"],body:[{heading:"환경 구성",paragraphs:[],blocks:[{type:"table",caption:"노션의 최신 환경 기록",headers:["항목","구성"],rows:[["운영체제","Ubuntu 24.04 LTS"],["Python","3.10"],["CUDA","12.1"],["cuDNN","9.8.0"],["Framework","PyTorch 2.9.1"],["Inference","vLLM"]]},{type:"table",caption:"LLM 설정",headers:["항목","값"],rows:[["모델","Qwen 2.5-14B-Instruct"],["파라미터","14B"],["정밀도","FP16, runtime INT8 연산"],["양자화","bitsandbytes"],["실행 위치","로컬 vLLM"]]}]},{heading:"서비스 분리",paragraphs:[],blocks:[{type:"paragraph",text:"LLM은 사용자 화면이나 검색 코드에 직접 넣지 않고 독립 추론 서비스로 실행한다. FastAPI가 검색 결과를 문맥으로 조립한 뒤 OpenAI 호환 형식으로 vLLM에 전달한다."},{type:"code",language:"text",caption:"요청 흐름",code:`React UI
  → FastAPI
    → MySQL\xb7FAISS 검색
      → 근거 문맥 구성
        → vLLM(Qwen 2.5 14B)
          → 답변\xb7근거 반환`},{type:"list",items:["검색 모델과 LLM을 최초 요청 때 한 번만 적재하고 이후 요청에서 재사용한다.","검색 실패와 LLM 실패를 구분해 어느 단계에서 문제가 생겼는지 남긴다.","모델 최대 문맥 길이와 GPU 메모리에 맞춰 동시 요청 수를 제한한다.","질문·근거·출력을 함께 보관해 같은 조건에서 결과를 다시 확인할 수 있게 한다."]}]},{heading:"확인 항목",paragraphs:[],blocks:[{type:"table",caption:"추론 환경 점검",headers:["점검","기준"],rows:[["모델 적재","14B 모델이 양자화 설정으로 정상 적재되는가"],["응답 생성","한국어 질문에 완결된 문장으로 응답하는가"],["문맥 반영","전달한 근거 안의 정보가 답변에 반영되는가"],["자원 안정성","반복 요청에서도 GPU 메모리가 계속 증가하지 않는가"],["재현성","모델·프롬프트·검색 조건을 기록할 수 있는가"]]}]}]},{slug:"joseon-annals-rag-storage",section:"projects",title:"조선왕조실록 정책·심리 추론 RAG(3) - 데이터 저장",summary:"실록 원문 347,491건을 utf8mb4 기반 MySQL 테이블에 적재하고, 복합 기본키로 사건의 고유성과 출처 추적성을 유지합니다.",updatedAt:_,tools:["MySQL","SQL","Ubuntu"],status:"완료",dataset:d,keywords:["관계형 데이터베이스","복합 기본키","원문 적재"],body:[{heading:"저장 구조",paragraphs:[],blocks:[{type:"paragraph",text:"원문은 왕·즉위연차·월·일·사건번호의 조합으로 구분한다. 같은 날 여러 사건이 존재하므로 날짜만으로는 고유성을 보장할 수 없고, 사건번호까지 포함한 복합 기본키가 필요하다."},{type:"code",language:"sql",caption:"원문 events 테이블",code:`CREATE TABLE events (
  king_code  VARCHAR(2) NOT NULL,
  reign_year VARCHAR(3) NOT NULL,
  month      VARCHAR(3) NOT NULL,
  day        VARCHAR(3) NOT NULL,
  event_no   INT NOT NULL,
  content    LONGTEXT NOT NULL,
  PRIMARY KEY (king_code, reign_year, month, day, event_no)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;`}]},{heading:"적재 결과",paragraphs:[],blocks:[{type:"table",caption:"CSV 적재 확인",headers:["항목","결과"],rows:[["입력","중복을 제거한 CSV"],["적재 행","347,491"],["삭제","0"],["건너뜀","0"],["경고","0"],["문자셋","utf8mb4"]]},{type:"list",items:["한글과 한자가 섞인 원문을 보존하기 위해 utf8mb4를 사용한다.","원문 길이 차이가 크므로 content는 LONGTEXT로 저장한다.","복합 기본키 충돌을 통해 중복 사건을 적재 단계에서 확인한다.","서비스 계정과 접속 정보는 콘텐츠나 코드에 평문으로 기록하지 않는다."]}]},{heading:"후속 테이블",paragraphs:[],blocks:[{type:"table",caption:"RAG 파이프라인의 저장 단위",headers:["저장 단위","역할"],rows:[["events","수집한 원문 이벤트"],["events_hierarchical_chunks","parent·sub 청크와 검색 본문"],["events_parent_chunk_embeddings","parent 임베딩과 참조 키"],["chunk_features","요약·주제·정책 신호"],["chat_message_logs","질문·답변·근거 기록"]]}]}]},{slug:"joseon-annals-rag-preprocessing",section:"projects",title:"조선왕조실록 정책·심리 추론 RAG(4) - 전처리와 임베딩",summary:"사건 단위를 보존하는 계층 청킹과 Qwen3-Embedding-4B 기반 2,560차원 parent 임베딩을 구현하고, 다음 검색 구조를 분리해 정리합니다.",updatedAt:_,tools:["Python","Qwen3-Embedding-4B","PyTorch"],status:"완료",dataset:d,architecture:"Parent/Sub hierarchical chunks · 2,560-d embeddings",keywords:["계층 청킹","임베딩","Mean Pooling","BGE-M3"],body:[{heading:"현재 구현",paragraphs:[],blocks:[{type:"list",ordered:!0,items:["공백·탭·줄바꿈을 한 칸으로 정규화한다.","실록의 사건 한 건을 기본 parent 청크로 사용한다.","긴 본문은 약 2,500자 기준으로 1차 분리한다.","긴 parent는 문장 경계를 우선해 200~600자 sub 청크로 나눈다.","문장 경계를 찾지 못하면 고정 길이로 나누고, 너무 짧은 조각은 앞 청크와 합친다.","왕·즉위연차·날짜 정보를 임베딩 입력의 prefix로 붙인다.","parent 청크를 Qwen3-Embedding-4B로 임베딩해 2,560차원 벡터로 저장한다."]},{type:"table",caption:"임베딩 설정",headers:["항목","값"],rows:[["모델","Qwen3-Embedding-4B"],["벡터 차원","2,560"],["최대 입력","2,048 tokens"],["배치 크기","12"],["저장 대상","parent 청크"],["검증","영벡터·결측 없음, L2 norm 분포 확인"]]}]},{heading:"패딩을 제외한 Mean Pooling",paragraphs:[],blocks:[{type:"paragraph",text:"배치 계산에는 패딩이 필요하지만, 패딩 토큰까지 평균에 포함하면 실제 문장의 표현이 흐려진다. attention mask로 유효 토큰만 더한 뒤 유효 길이로 나눈다."},{type:"code",language:"python",caption:"Mean Pooling",code:`def mean_pooling(last_hidden_state, attention_mask):
    mask = attention_mask.unsqueeze(-1).to(last_hidden_state.dtype)
    summed = (last_hidden_state * mask).sum(dim=1)
    counts = mask.sum(dim=1).clamp(min=1e-9)
    return summed / counts`}]},{heading:"초기 설계와 최신 개선안",paragraphs:[],blocks:[{type:"table",caption:"구현 상태를 구분한 정리",headers:["구분","현재 구현","개선 검토"],rows:[["임베딩","Qwen3-Embedding-4B","BGE-M3 비교"],["검색 표현","Dense vector","Dense · Sparse · Multi-vector 결합"],["청킹","2,500자 parent, 200~600자 sub","사건 전체를 더 길게 보존하는 기준 비교"],["언어 간극","원문 직접 임베딩","현대어 풀이를 별도 표현으로 생성"],["결합 방식","단일 유사도","표현별 점수를 가중 결합"]]},{type:"quote",text:"BGE-M3와 현대어 풀이 경로는 최신 설계 메모에 포함된 개선안이며, 현재 구현된 Qwen3 임베딩 결과와 같은 단계로 표시하지 않는다."}]}]},{slug:"joseon-annals-rag-retrieval",section:"projects",title:"조선왕조실록 정책·심리 추론 RAG(5) - 검색과 컨텍스트",summary:"정규화한 parent 벡터를 FAISS로 검색한 뒤 sub 청크를 재정렬하고, 출처 메타데이터를 포함한 근거 문맥을 구성합니다.",updatedAt:_,tools:["FAISS","MySQL","Python"],status:"완료",dataset:d,architecture:"FAISS IndexFlatIP · Parent retrieval · Sub reranking",keywords:["Vector Search","Reranking","Context Builder"],body:[{heading:"현재 검색 흐름",paragraphs:[],blocks:[{type:"list",ordered:!0,items:["사용자 질문에서 왕 이름·즉위연차·정책 단서를 추출한다.","질문을 문서와 같은 임베딩 모델로 변환하고 L2 정규화한다.","FAISS IndexFlatIP에서 parent 후보를 넓게 검색한다.","왕과 연차 메타데이터로 관련 없는 후보를 제거한다.","남은 parent의 sub 청크를 질문과 다시 비교해 세부 근거를 재정렬한다.","원문·날짜·유사도·청크 ID를 한 근거 단위로 구성한다.","근거만 포함한 프롬프트를 vLLM에 전달한다."]},{type:"code",language:"text",caption:"검색 단계",code:`질문
  → query embedding
  → parent Top-K
  → 왕\xb7연차 필터
  → sub chunk rerank
  → evidence context
  → Qwen answer`}]},{heading:"FAISS 선택",paragraphs:[],blocks:[{type:"table",caption:"인덱스 구성",headers:["항목","내용"],rows:[["인덱스","IndexFlatIP"],["유사도","정규화 벡터의 inner product"],["색인 대상","parent 청크"],["세부 선택","sub 청크 재정렬"],["원문 조회","MySQL"]]},{type:"paragraph",text:"IndexFlatIP는 근사 검색이 아니라 모든 벡터를 비교하므로 초기 품질 검증에 적합하다. 검색량이 커지면 인덱스 구조를 바꾸더라도, 같은 평가 질의에서 근거가 얼마나 달라지는지 먼저 비교해야 한다."}]},{heading:"발견한 문제와 수정",paragraphs:[],blocks:[{type:"table",caption:"검색 진단",headers:["문제","원인","대응"],rows:[["다른 왕의 원문이 상위에 노출","의미 유사도가 메타데이터보다 먼저 작동","후보 수를 넓히고 왕 필터를 적용"],["근거가 너무 넓음","parent 전체만 사용","sub 청크 재정렬"],["검색 결과와 원문 연결 오류","벡터 순서와 DB 키 매핑 문제","고유 parent ID 배열을 함께 저장"],["표현이 다른 질문에 약함","단일 dense 검색","Sparse·Multi-vector 결합 검토"]]}]},{heading:"컨텍스트 원칙",paragraphs:[],blocks:[{type:"list",items:["각 근거에 왕·즉위연차·날짜를 함께 넣는다.","답변에서 인용할 수 있도록 근거 번호를 고정한다.","검색 점수는 관련도이지 역사적 사실의 신뢰도 점수가 아님을 구분한다.","근거가 부족하면 추론을 늘리지 않고 한계를 답변에 표시한다."]}]}]},{slug:"joseon-annals-rag-api",section:"projects",title:"조선왕조실록 정책·심리 추론 RAG(6) - 처리 계층",summary:"FastAPI가 질문 검증부터 검색, 컨텍스트 구성, vLLM 호출, 근거 반환과 로그 저장까지 이어지는 처리 흐름을 맡습니다.",updatedAt:_,tools:["FastAPI","Pydantic","PyMySQL","FAISS"],status:"완료",dataset:d,architecture:"React → FastAPI → MySQL·FAISS → vLLM",keywords:["API","RAG Service","Lazy Loading"],body:[{heading:"서비스 구조",paragraphs:[],blocks:[{type:"code",language:"text",caption:"서비스 구성",code:`Browser
  → React
    → FastAPI
      ├─ MySQL: 원문\xb7메타데이터\xb7로그
      ├─ FAISS: parent vector search
      ├─ Embedding model: query vector
      └─ vLLM: grounded answer generation`},{type:"paragraph",text:"FastAPI는 화면과 모델 사이의 단순 중계가 아니라, 검색 단계와 답변 근거를 하나의 요청 단위로 관리하는 처리 계층이다."}]},{heading:"API",paragraphs:[],blocks:[{type:"table",caption:"주요 엔드포인트",headers:["메서드","경로","역할"],rows:[["GET","/health","API와 모델 의존성 상태 확인"],["POST","/api/chat/messages","질문 검색·추론·근거 반환"],["GET","/api/chat/sessions","사용자별 대화 목록"],["GET","/api/chat/history/{session_id}","대화와 근거 이력"]]}]},{heading:"한 요청의 처리 순서",paragraphs:[],blocks:[{type:"list",ordered:!0,items:["요청 형식과 질문 길이를 검증한다.","질문에서 왕·연차·정책 단서를 파싱한다.","임베딩 모델과 FAISS 인덱스를 lazy load한다.","parent 후보를 검색한다.","메타데이터 필터를 적용한다.","sub 청크를 재정렬한다.","근거 번호와 메타데이터를 구성한다.","프롬프트에 근거 밖 추측 금지 조건을 넣는다.","vLLM에 추론을 요청한다.","출력 형식을 정리하고 근거 참조를 연결한다.","질문·검색 조건·근거·응답을 로그로 저장한다.","React가 사용할 응답 객체로 반환한다."]}]},{heading:"운영 기준",paragraphs:[],blocks:[{type:"list",items:["임베더와 FAISS 인덱스는 요청마다 다시 읽지 않고 프로세스 안에서 재사용한다.","vLLM 자원과 API 자원을 분리해 어느 서비스가 병목인지 확인한다.","시간 초과·검색 결과 없음·모델 오류를 같은 오류로 뭉치지 않는다.","허용하는 클라이언트와 요청 크기를 제한한다.","비밀번호와 내부 주소는 환경 변수로 관리하고 기록 화면에 노출하지 않는다."]}]}]},{slug:"joseon-annals-rag-ui",section:"projects",title:"조선왕조실록 정책·심리 추론 RAG(7) - 결과 UI",summary:"질문과 답변, 원문 근거를 분리하되 서로 연결하고, 사용자가 답변의 판단 근거를 바로 확인할 수 있는 React 화면을 구성합니다.",updatedAt:_,tools:["React","Vite","TypeScript"],status:"완료",dataset:d,architecture:"Conversation panel · Evidence panel",keywords:["근거 UI","상태 피드백","접근성"],body:[{heading:"화면 구조",paragraphs:[],blocks:[{type:"table",caption:"주요 영역",headers:["영역","내용"],rows:[["질문 입력","왕·연차·정책을 포함한 질문"],["대화","질문과 근거 기반 답변"],["원문","검색된 실록 원문과 메타데이터"],["상태","검색 · 문맥 구성 · 추론 진행 단계"],["세부 정보","관련도와 청크 계층"]]},{type:"paragraph",text:"답변과 원문을 한 덩어리로 붙이지 않고 두 영역으로 나눈다. 대신 답변의 [근거N]을 누르면 해당 원문 카드가 강조되고 시야가 그 위치로 이동하게 해 읽기의 연결을 유지한다."}]},{heading:"핵심 상호작용",paragraphs:[],blocks:[{type:"list",items:["Enter는 전송, Shift+Enter는 줄바꿈으로 구분한다.","답변별 원문 묶음은 펼치고 접을 수 있게 한다.","근거 번호를 누르면 대응하는 원문을 강조하고 자동으로 이동한다.","왕·연도·관련도 기준으로 원문을 읽을 수 있게 한다.","새 대화를 시작해도 이전 세션의 질문과 근거를 다시 열 수 있게 한다.","오류는 짧은 안내와 함께 어느 단계에서 실패했는지 확인할 수 있게 한다.","요약 답변과 상세 근거의 위계를 분리해 첫 화면의 밀도를 낮춘다."]}]},{heading:"메타데이터 표시",paragraphs:[],blocks:[{type:"paragraph",text:"내부 chunk_id를 그대로 보여주기보다 사람이 읽을 수 있는 왕·즉위연차·월·일·사건번호로 해석해 표시한다. 유사도 점수도 모델의 확신처럼 보이지 않도록 ‘관련도’로 명명한다."},{type:"table",caption:"표시 변환 예",headers:["내부 값","화면 표시"],rows:[["king_code","왕"],["reign_year","즉위 연차"],["month / day","기록 날짜"],["event_no","사건 순서"],["parent_score","관련도"],["parent / sub","원문 · 세부 근거"]]}]},{heading:"상태와 접근성",paragraphs:[],blocks:[{type:"list",items:["검색 중과 추론 중을 한 개의 로딩 표시로 뭉치지 않는다.","근거 강조는 색상뿐 아니라 테두리와 위치 이동을 함께 사용한다.","접힌 근거와 버튼 상태를 키보드와 스크린리더가 알 수 있게 한다.","긴 원문은 영역 안에서 읽히게 하고 전체 페이지의 가로 스크롤을 만들지 않는다.","실패한 질문은 입력을 유지해 수정 후 다시 보낼 수 있게 한다."]}]}]},{slug:"joseon-annals-rag-improvements",section:"projects",title:"조선왕조실록 정책·심리 추론 RAG(8) - 평가와 개선",summary:"반복적인 답변, 다른 왕의 근거 노출, 현대어 질문과 원문의 표현 차이를 주요 문제로 두고 검색·군집·프롬프트 개선안을 정리합니다.",updatedAt:_,tools:["HDBSCAN","LLM Labeling","FAISS","Evaluation"],status:"진행 중",dataset:d,architecture:"Feature extraction · Clustering · Weighted retrieval",keywords:["검색 평가","키워드 카탈로그","현대어 풀이","근거 한계"],body:[{heading:"현재 확인한 문제",paragraphs:[],blocks:[{type:"table",caption:"오류 유형과 원인",headers:["문제","관찰","가능한 원인"],rows:[["답변 반복","질문이 달라도 비슷한 항목과 표현이 반복됨","출력 형식을 지나치게 고정한 프롬프트"],["왕 혼동","질문한 왕이 아닌 기록이 상위 근거로 등장","의미 점수 이전의 메타데이터 제한 부족"],["표현 간극","현대어 질문과 한자어·고어 원문의 연결이 약함","단일 표현 공간에만 의존"],["긴 청크","한 근거 안에 여러 정책 신호가 섞임","청크 기준과 재정렬 부족"],["해석 과잉","근거보다 강한 심리 표현이 생성될 수 있음","한계 표시와 평가 기준 부족"]]}]},{heading:"최신 개선 파이프라인",paragraphs:[],blocks:[{type:"list",ordered:!0,items:["각 청크에서 요약·키워드·주제·정책 신호를 추출한다.","HDBSCAN으로 의미가 비슷한 청크를 군집화하고 노이즈를 분리한다.","LLM이 군집의 대표 이름을 제안하고 사람이 검수한다.","군집 라벨과 구조 키워드를 버전이 있는 카탈로그로 관리한다.","왕별 정책 반응과 시기별 변화는 근거 ID와 함께 별도 메모리로 구성한다.","기본 dense 점수와 키워드·메타데이터 점수를 가중 결합한다.","현대어 풀이 표현을 추가해 질문과 원문의 언어 간극을 줄인다.","동일 평가 질의에서 근거 적합도와 답변 충실도를 다시 측정한다."]},{type:"code",language:"text",caption:"개선 검색 흐름",code:`원문
  → 계층 청크
  → feature\xb7keyword 추출
  → HDBSCAN 군집
  → LLM 라벨 + 검수
  → keyword catalog
  → dense\xb7keyword\xb7metadata weighted retrieval
  → evidence-grounded answer`}]},{heading:"적용 상태",paragraphs:[],blocks:[{type:"table",caption:"구현과 계획 구분",headers:["항목","상태","확인 기준"],rows:[["Qwen3 parent 임베딩","구현","벡터 수·차원·결측 검증"],["FAISS parent 검색 + sub 재정렬","구현","근거 ID와 원문 일치"],["왕·연차 메타데이터 제한","보완 중","다른 왕 근거 비율"],["청크 feature와 군집화","설계·실험","군집 응집도와 라벨 일관성"],["BGE-M3 혼합 검색","검토","동일 질의의 근거 적합도 비교"],["현대어 풀이 임베딩","검토","원문 보존과 검색 향상 동시 확인"],["파인튜닝","보류","RAG·검색 개선 후 필요성 재평가"]]}]},{heading:"평가 원칙",paragraphs:[],blocks:[{type:"list",items:["검색 평가는 답변 문장보다 먼저, 선택된 원문이 질문과 맞는지 확인한다.","정답 근거가 있는 평가 질의 세트를 고정해 변경 전후를 비교한다.","답변의 모든 핵심 주장에 대응하는 원문 근거가 있는지 측정한다.","왕의 심리와 성향은 사료에서 관찰한 정책 판단 패턴에 대한 제한적 해석으로 표시한다.","근거가 부족하거나 상충하면 확정하지 않고 그 한계를 결과에 남긴다."]},{type:"quote",text:"이 프로젝트의 목표는 왕의 내면을 사실처럼 판정하는 것이 아니라, 실록 근거를 따라 정책 판단의 반복·변화·제약을 탐색하는 것이다."}]}]}].map((a,t)=>({label:u[t]??`단계 ${t+1}`,entry:a})))],[...h([{label:"ORS 환경·역 접근시간",entry:s},{label:"표본 필터·교육 접근도",entry:m},{label:"생활시설·파생변수·TimesNet 준비",entry:g},{label:"성능 진단·Event Study",entry:l}])],[...c.body],[["deep-learning-roadmap-tensors-shapes","텐서와 Shape — 신경망 계산의 공통 언어"],["deep-learning-roadmap-matrix-affine","행렬 연산과 Affine 변환 — XW+b를 계산하는 방법"],["deep-learning-roadmap-chain-rule-backprop","연쇄법칙과 역전파 — 계산 그래프로 Gradient 따라가기"],["deep-learning-roadmap-probability-losses","손실함수의 확률 해석 — MLE·NLL·Cross-Entropy·KL"],["deep-learning-roadmap-linear-logistic-softmax","회귀모형을 직접 학습하기 — Linear·Logistic·Softmax"],["deep-learning-roadmap-mlp-training","MLP와 학습 안정화 — 초기화·정규화·Optimizer"],["deep-learning-roadmap-cnn-operations","합성곱의 계산 구조 — Kernel·Stride·Padding·Output Shape"],["deep-learning-roadmap-resnet","깊은 CNN과 ResNet — Residual 경로와 Gradient 흐름"],["deep-learning-roadmap-rnn-lstm","RNN과 LSTM — 시간축 상태와 BPTT"],["deep-learning-roadmap-seq2seq-attention","Seq2Seq와 Attention — Q·K·V로 Context 계산하기"],["deep-learning-roadmap-transformer","Transformer — Multi-Head Attention과 Block 구조"],["deep-learning-roadmap-autoregressive","Autoregressive 생성 — Next Token Prediction과 Decoding"],["deep-learning-roadmap-vae","VAE — ELBO와 Reparameterization"],["deep-learning-roadmap-gan","GAN — Generator와 Discriminator의 교대 학습"],["deep-learning-roadmap-diffusion","Diffusion — Noise 추가부터 Denoising까지"]].map(([a,t])=>({slug:a,section:"learning",topic:"deep-learning-roadmap",title:t,summary:"",updatedAt:"2026-08-10",status:"작성 예정",body:[]})));String.raw`양적 반응변수 $Y$와 $p$개의 서로 다른 예측변수 $X_1, X_2, \ldots, X_p$를 관측하고 $Y$와 $X$ 사이에 어떤 관계가 있다고 가정하면 다음과 같이 쓸 수 있다.`,String.raw`통계적 학습의 기본 모형 $Y=f(X)+\epsilon$`,String.raw`Y=f(X)+\epsilon`,String.raw`$f$는 예측변수에 대한 고정된 미지의 함수이다. $\epsilon$은 $X$와 독립이고 평균이 0인 랜덤 오차항이다.`,String.raw`파란색 곡선: $f$는 우리가 모르는 함수이므로 관측점을 바탕으로 추정해야 한다.`,String.raw`세로선: 각 관측값의 오차항 $\epsilon$을 나타내며, 오차항은 평균적으로 0이라고 가정한다.`,String.raw`$f$를 추정하는 이유는 크게 예측과 추론으로 나눌 수 있다.`,String.raw`입력 집합 $X$는 쉽게 확보할 수 있지만 출력 $Y$는 얻기 어려운 경우가 많다. 오차항 $\epsilon$의 평균이 0이므로 $Y$를 다음과 같이 예측할 수 있다.`,String.raw`예측식 $\hat{Y}=\hat{f}(X)$`,String.raw`\hat{Y}=\hat{f}(X)`,String.raw`$\hat{f}$는 $f$의 추정값이고, $\hat{Y}$는 그 결과로 얻은 $Y$의 예측값이다. 예측에서는 $\hat{f}$의 정확한 형태보다 $Y$를 얼마나 정확히 맞히는지가 중요하므로 $\hat{f}$를 블랙박스로 다루기도 한다.`,String.raw`$X_1,X_2,\ldots,X_p$를 환자 혈액 샘플의 특성으로, $Y$를 특정 약물에 대한 심각한 부작용의 위험으로 두면 $X$를 이용해 $Y$를 예측할 수 있다.`,String.raw`$Y$에 대한 예측값 $\hat{Y}$의 정확도는 축소가능 오차(reducible error)와 축소불가능 오차(irreducible error)의 크기에 따라 달라진다.`,String.raw`축소가능 오차: $\hat{f}$가 $f$를 부정확하게 추정해서 생기는 오차로, 더 나은 통계적 학습 방법을 사용하면 정확도를 잠재적으로 높일 수 있다.`,String.raw`축소불가능 오차: 오차항 $\epsilon$의 영향으로 생기며 통계적 학습 방법만으로는 줄일 수 없다. 약 제조 과정의 변동이나 환자의 건강 상태처럼 측정하지 않은 요인이 여기에 해당할 수 있다.`,String.raw`$\hat{f}$와 $X$가 고정되어 있고 $\epsilon$에서만 변동이 생긴다고 가정하면 다음 관계가 성립한다.`,String.raw`\mathbb{E}\left[(Y-\hat{Y})^2\right]=\left[f(X)-\hat{f}(X)\right]^2+\operatorname{Var}(\epsilon)`,String.raw`$\mathbb{E}[(Y-\hat{Y})^2]$는 실제값과 예측값 차이의 제곱에 대한 기댓값이고, $\operatorname{Var}(\epsilon)$은 오차항의 분산이다. 이 책에서는 주로 축소가능한 부분, 즉 $f$를 더 잘 추정하는 기법에 초점을 맞춘다.`,String.raw`정확한 $Y$값을 예측하는 것보다 $Y$와 $X$ 사이의 연관성을 이해하려는 경우에는 $\hat{f}$를 단순한 블랙박스로 취급하지 않고 그 정확한 형태를 파악하는 것이 목표가 된다.`,String.raw`$Y$와 각 예측변수 사이의 관계를 선형식으로 적절히 요약할 수 있는가, 아니면 더 복잡한가?`,String.raw`목표는 통계적 학습 방법을 훈련 데이터에 적용해 $f$를 추정하는 것이다. 대부분의 학습 방법은 모수적(parametric) 방법과 비모수적(non-parametric) 방법으로 나눌 수 있다.`,String.raw`$f$의 함수 형태나 모형을 가정한다. 예를 들어 $f$가 $X$의 선형함수라고 가정한다.`,String.raw`f(X)=\beta_0+\beta_1X_1+\beta_2X_2+\cdots+\beta_pX_p`,String.raw`이렇게 하면 $p$차원 함수 $f(X)$ 전체를 추정하는 대신 $p+1$개의 모수 $\beta_0,\beta_1,\ldots,\beta_p$만 추정하면 된다.`,String.raw`즉 모수적 방법은 $f$의 형태를 가정해 함수 추정 문제를 유한한 모수 집합의 추정 문제로 단순화한다. 다만 가정한 형태가 미지의 참 함수 $f$와 일치하지 않을 수 있다. 이를 보완하려고 더 유연한 모형을 선택할 수 있지만, 지나치게 복잡한 모형은 데이터에 과적합(overfitting)될 수 있다.`,String.raw`함수 $f$를 선형모형이라고 가정했을 때 적합 평면은 관측값인 빨간 점에 완전히 들어맞지 않는다.`,String.raw`비모수적 방법은 $f$의 함수 형태를 명시적으로 가정하지 않는다. 대신 관측값에 가능한 한 가까운 함수의 추정값을 구한다. 적은 수의 모수로 문제를 축소하지 않으므로 $f$를 정확히 추정하려면 매우 많은 관측값이 필요할 수 있다.`,String.raw`비모수적 방법은 $f$의 모형을 미리 지정하지 않고 관측 데이터에 최대한 가깝게 적합하려 한다. 하지만 지나치게 관측값을 따라가면 앞선 선형모형보다 과적합될 가능성이 커지고, 훈련 데이터에는 잘 맞더라도 보지 못한 테스트 데이터에 대한 예측이 나빠질 수 있다.`,String.raw`이 그림에서는 $X_1$과 $X_2$의 분포를 보고 군집을 확인할 수 있다. 하지만 현실에서는 변수가 두 개보다 훨씬 많으므로 시각적인 검토만으로 군집을 분석하기 어렵다.`,String.raw`\operatorname{MSE}=\frac{1}{n}\sum_{i=1}^{n}\left(y_i-\hat{f}(x_i)\right)^2`,String.raw`각 항 $(y_i-\hat{f}(x_i))^2$은 $i$번째 관측의 실제 반응값 $y_i$와 예측값 $\hat{f}(x_i)$ 사이의 제곱오차다. MSE가 작을수록 예측값이 실제값에 가깝다.`,String.raw`훈련 MSE는 모형을 적합하는 데 사용한 훈련 데이터로 계산한다. 하지만 우리가 더 관심을 두어야 하는 것은 훈련에 쓰지 않은 테스트 관측 $(x_0,y_0)$에 모형을 적용했을 때의 정확도다.`,String.raw`\operatorname{Ave}\left(y_0-\hat{f}(x_0)\right)^2`,String.raw`주어진 $x_0$에서의 기대 테스트 MSE는 $\hat{f}(x_0)$의 분산, 편향의 제곱, 그리고 오차항 $\epsilon$의 분산이라는 세 가지 기본 수량의 합으로 분해된다.`,String.raw`\mathbb{E}\left[\left(y_0-\hat{f}(x_0)\right)^2\right]=\operatorname{Var}\left(\hat{f}(x_0)\right)+\left[\operatorname{Bias}\left(\hat{f}(x_0)\right)\right]^2+\operatorname{Var}(\epsilon)`,String.raw`왼쪽의 $\mathbb{E}[(y_0-\hat{f}(x_0))^2]$은 여러 훈련 데이터세트에서 반복해 $f$를 추정했을 때의 평균적인 테스트 MSE다. $\operatorname{Var}(\epsilon)$은 축소불가능 오차이므로, 낮은 분산과 낮은 편향을 함께 달성하는 방법을 골라 기대 테스트 MSE를 줄여야 한다.`,String.raw`분산은 다른 훈련 데이터세트로 $\hat{f}$를 추정했을 때 추정 결과가 얼마나 변하는지를 나타낸다. 분산이 높은 방법은 훈련 데이터의 작은 변화만으로도 $\hat{f}$가 크게 달라질 수 있다. 일반적으로 유연한 통계적 방법일수록 개별 관측값에 더 의존하므로 분산이 높다.`,String.raw`\frac{1}{n}\sum_{i=1}^{n}I(y_i\neq\hat{y}_i)`,String.raw`$\hat{y}_i$는 $\hat{f}$를 사용해 $i$번째 관측에서 예측한 분류 레이블이다. 지시함수 $I(y_i\neq\hat{y}_i)$는 예측이 틀리면 1, 올바르면 0이다.`,String.raw`\operatorname{Ave}\left(I(y_0\neq\hat{y}_0)\right)`,String.raw`평균 테스트 오류율을 최소화하는 가장 단순한 방법은 예측변수 벡터 $x_0$가 주어졌을 때 조건부 확률이 가장 높은 부류에 관측값을 할당하는 것이다.`,String.raw`\operatorname*{arg\,max}_{j}\Pr(Y=j\mid X=x_0)`,String.raw`$\Pr(Y=j\mid X=x_0)$는 예측변수 벡터 $x_0$가 주어졌을 때 $Y$가 부류 $j$일 조건부 확률이다. 이 규칙은 두 부류뿐 아니라 여러 부류가 있는 다중 클래스 문제에도 적용된다. 이를 베이즈 분류기(Bayes classifier)라고 한다.`,String.raw`주황색 음영: $\Pr(Y=\text{orange}\mid X)>0.5$인 점의 집합`,String.raw`파란색 음영: $\Pr(Y=\text{orange}\mid X)<0.5$인 점의 집합`,String.raw`보라색 파선: $\Pr(Y=\text{orange}\mid X)=0.5$인 점의 집합으로, 베이즈 결정경계(Bayes decision boundary)다.`,String.raw`1-\mathbb{E}\left(\max_j \Pr(Y=j\mid X)\right)`,String.raw`현실 데이터에서는 조건부 분포를 알 수 없으므로 베이즈 분류기를 직접 계산할 수 없다. 베이즈 분류기는 도달할 수 없는 황금 표준으로 두고 다른 분류기를 사용해야 한다. 그중 하나가 K-최근접 이웃(KNN, K-nearest neighbors) 분류기다. 양의 정수 $K$와 테스트 관측 $x_0$가 주어지면 훈련 데이터에서 $x_0$에 가장 가까운 $K$개의 점을 찾는다.`,String.raw`\Pr(Y=j\mid X=x_0)=\frac{1}{K}\sum_{i\in\mathcal{N}_0}I(y_i=j)`,String.raw`주황색 음영: $\Pr(Y=\text{orange}\mid X)>0.5$인 점의 집합`,String.raw`파란색 음영: $\Pr(Y=\text{orange}\mid X)<0.5$인 점의 집합`,String.raw`검정색 선: $\Pr(Y=\text{orange}\mid X)=0.5$인 점의 집합으로, KNN 결정경계다.`,String.raw`H_0:\beta_1=\beta_2=\beta_3=0 \qquad H_A:\text{적어도 하나의 }\beta_j\ne0`,String.raw`\operatorname{VIF}_j=\frac{1}{1-R_j^2}`,String.raw`\operatorname{sales}=\beta_0+\beta_1\operatorname{TV}+\beta_2\operatorname{radio}+\beta_3(\operatorname{TV}\times\operatorname{radio})+\epsilon`,String.raw`\hat f(x_0)=\frac{1}{K}\sum_{i\in\mathcal{N}_0}y_i`,String.raw`Y=\beta_0+\beta_1X_1+\beta_2X_2+\cdots+\beta_pX_p+\epsilon`,String.raw`$\beta_0$는 절편(intercept)이다. $\beta_j$는 다른 모든 예측변수가 고정된 상태에서 $X_j$가 한 단위 증가할 때 $Y$의 조건부 평균이 얼마나 변하는지를 나타내는 기울기(slope)다. 관찰 데이터에서 이 계수를 곧바로 인과효과로 해석해서는 안 된다.`,String.raw`\operatorname{sales}=\beta_0+\beta_1\operatorname{TV}+\beta_2\operatorname{radio}+\beta_3\operatorname{newspaper}+\epsilon`,String.raw`\hat{y}_i=\hat{\beta}_0+\hat{\beta}_1x_{i1}+\hat{\beta}_2x_{i2}+\cdots+\hat{\beta}_px_{ip}`,String.raw`최소제곱 추정량은 잔차제곱합(RSS)을 최소로 만드는 $\hat{\beta}_0,\hat{\beta}_1,\ldots,\hat{\beta}_p$다.`,String.raw`\operatorname{RSS}=\sum_{i=1}^{n}(y_i-\hat{y}_i)^2=\sum_{i=1}^{n}\left(y_i-\hat{\beta}_0-\sum_{j=1}^{p}\hat{\beta}_jx_{ij}\right)^2`,String.raw`예측변수 $X_1,X_2,\ldots,X_p$ 중 적어도 하나는 반응변수 예측에 유용한가?`,String.raw`모든 예측변수가 $Y$를 설명하는 데 유용한가, 아니면 일부 변수의 집합만 유용한가?`,String.raw`먼저 절편을 제외한 기울기 $\beta_1,\beta_2,\ldots,\beta_p$가 모두 0인지 전체 가설검정으로 확인한다.`,String.raw`H_0:\beta_1=\beta_2=\cdots=\beta_p=0\qquad\text{vs.}\qquad H_a:\exists j\text{ such that }\beta_j\ne0`,String.raw`F=\frac{(\operatorname{TSS}-\operatorname{RSS})/p}{\operatorname{RSS}/(n-p-1)}`,String.raw`여기서 $\operatorname{TSS}=\sum_{i=1}^{n}(y_i-\bar{y})^2$이고 $\operatorname{RSS}=\sum_{i=1}^{n}(y_i-\hat{y}_i)^2$이다.`,String.raw`\mathbb{E}\!\left[\frac{\operatorname{RSS}}{n-p-1}\right]=\sigma^2,\qquad \mathbb{E}\!\left[\frac{\operatorname{TSS}-\operatorname{RSS}}{p}\right]=\sigma^2\quad(H_0)`,String.raw`$H_0$가 참이면 분자와 분모가 모두 $\sigma^2$을 추정하므로 $F$는 대체로 1 부근에 있다. $H_a$가 참이면 분자가 더 커지는 경향이 있어 $F$가 1보다 커진다. 다만 1보다 크다는 사실만으로 결론을 내리지 않고, $F_{p,n-p-1}$ 분포에서 계산한 p값으로 기각 여부를 판단한다.`,String.raw`H_0:\beta_{p-q+1}=\beta_{p-q+2}=\cdots=\beta_p=0`,String.raw`F=\frac{(\operatorname{RSS}_0-\operatorname{RSS})/q}{\operatorname{RSS}/(n-p-1)}`,String.raw`$\operatorname{RSS}_0$은 검정할 q개 예측변수를 제외하고 적합한 축소모형의 잔차제곱합이고, $\operatorname{RSS}$는 그 변수들을 포함한 전체모형의 잔차제곱합이다. $q=1$이면 부분 F 검정은 해당 계수의 양측 t 검정과 동등하며 $F=t^2$이다.`,String.raw`$p\ge n$이거나 설계행렬의 열이 선형종속이면 고전적인 최소제곱 계수는 유일하지 않다. 또한 잔차 자유도를 확보하려면 $n>p+1$이어야 하므로 이 조건을 만족하지 않으면 표준적인 F 검정을 사용할 수 없다.`,String.raw`$p$개 변수의 모든 부분집합은 영모형을 포함해 총 $2^p$개다. 예를 들어 $p=2$면 네 모형이지만, p가 커지면 모든 모형을 직접 적합하기가 빠르게 어려워진다.`,String.raw`Mallows의 $C_p$, AIC(Akaike Information Criterion), BIC(Bayesian Information Criterion)는 후보 모형을 평가하는 대표적인 기준이다. 이들은 변수 부분집합을 탐색하는 알고리즘 자체가 아니라 적합도와 복잡도를 함께 비교하는 선택 기준이며, 자세한 내용은 6장에서 다룬다.`,String.raw`전진선택은 $p>n$인 상황에서도 후보를 단계적으로 추가할 수 있지만, 적합 가능한 변수 수와 추론에는 제약이 있다. 후진선택은 처음부터 전체모형을 적합해야 하므로 $p\ge n$에서는 사용할 수 없다. 혼합선택은 앞서 넣은 변수를 다시 뺄 수 있다는 장점이 있지만 전역 최적 모형이나 안정적인 추론을 보장하지는 않는다.`,String.raw`다중선형회귀의 적합도를 설명하는 대표적인 수치형 측도는 잔차표준오차(RSE)와 $R^2$이다. 계산과 기본 해석은 단순선형회귀에서와 같다.`,String.raw`R^2=1-\frac{\operatorname{RSS}}{\operatorname{TSS}}=\operatorname{Cor}(Y,\hat{Y})^2`,String.raw`단순선형회귀에서 $R^2$은 반응변수와 예측변수의 상관계수 제곱이다. 절편을 포함한 다중선형회귀에서는 반응변수 $Y$와 적합값 $\hat{Y}$의 상관계수 제곱이며, 1에 가까울수록 반응변수 변동의 많은 부분을 설명한다.`,String.raw`Advertising 데이터에서 TV, radio, newspaper를 모두 사용한 모형의 $R^2$은 약 0.8972이고, TV와 radio만 사용한 모형의 $R^2$은 약 0.89719다. newspaper를 추가했을 때 증가량은 매우 작다.`,String.raw`훈련 데이터의 $R^2$은 예측변수를 추가하면 감소하지 않는다. 새 변수가 RSS를 조금이라도 줄일 수 있기 때문이다. 따라서 미미한 $R^2$ 증가만으로 변수의 유용성이나 과적합을 확정해서는 안 되며, 조정 $R^2$, AIC·BIC, 교차검증, 검정 결과 등을 함께 살펴야 한다.`,String.raw`\operatorname{RSE}=\sqrt{\frac{\operatorname{RSS}}{n-p-1}}`,String.raw`다중선형회귀를 적합한 뒤에는 새로운 예측변수 값 $x_0$에서 반응변수 $Y$를 예측할 수 있다. 이때 계수 추정, 모형의 형태, 랜덤 오차라는 세 가지 불확실성을 구분해야 한다.`,String.raw`\hat{Y}=\hat{\beta}_0+\hat{\beta}_1X_1+\cdots+\hat{\beta}_pX_p`,String.raw`f(X)=\beta_0+\beta_1X_1+\cdots+\beta_pX_p`,String.raw`계수 추정의 불확실성: 최소제곱평면 $\hat{f}(x_0)$은 참 평균반응 $f(x_0)$의 추정치다. 표본을 더 잘 수집하면 줄일 수 있는 축소가능 오차이며, 평균반응에 대한 신뢰구간으로 표현한다.`,String.raw`모형 편향: 참 함수 $f$가 정확히 선형이 아니라면 선형모형 가정 자체에서 근사 오차가 생긴다. 통상적인 회귀 신뢰구간과 예측구간은 선형모형이 맞다는 가정 아래 계산되므로 이 편향을 자동으로 포함하지 않는다.`,String.raw`축소불가능 오차: 참 계수를 모두 알아도 랜덤 오차항 $\epsilon$ 때문에 개별 반응값 $Y$를 완벽히 예측할 수 없다.`,String.raw`같은 $x_0$와 신뢰수준에서 새 개별 관측값 $Y$의 예측구간은 평균반응 $f(x_0)$의 신뢰구간보다 항상 넓다. 예측구간에는 평균 추정의 불확실성뿐 아니라 새 관측의 랜덤 오차까지 포함되기 때문이다.`,String.raw`\widehat{\text{아파트 거래가격}}=\hat{\beta}_0+\hat{\beta}_1\,\text{전용면적}+\hat{\beta}_2\,\text{층}+\hat{\beta}_3\,\text{유명 브랜드 여부}+\hat{\beta}_4\,\text{건축연한}+\hat{\beta}_5\,\text{KOSPI}+\hat{\beta}_6\,\text{환율}`,String.raw`x_i=\begin{cases}1,&\text{주택 소유자}\\-1,&\text{주택 비소유자}\end{cases}`,String.raw`이미지처럼 $1/-1$ 코딩을 쓰면 두 집단의 평균은 각각 $\beta_0+\beta_1$과 $\beta_0-\beta_1$이고, 두 평균의 차이는 $2\beta_1$이다. 해석을 더 단순하게 하려면 비소유자를 0, 소유자를 1로 코딩할 수 있다.`,String.raw`Y_i=\beta_0+\beta_1x_i+\epsilon_i,\qquad x_i=\begin{cases}1,&\text{주택 소유자}\\0,&\text{주택 비소유자}\end{cases}`,String.raw`$\beta_0$: 주택 비소유자의 평균 신용카드 잔액`,String.raw`$\beta_0+\beta_1$: 주택 소유자의 평균 신용카드 잔액`,String.raw`$\beta_1$: 소유자 평균에서 비소유자 평균을 뺀 차이`,String.raw`Y_i=\beta_0+\beta_1x_{i1}+\beta_2x_{i2}+\epsilon_i`,String.raw`$\beta_0$: 기준범주인 East 출신의 평균 잔액`,String.raw`$\beta_1$: South 평균에서 East 평균을 뺀 차이`,String.raw`$\beta_2$: West 평균에서 East 평균을 뺀 차이`,String.raw`Y=\beta_0+\beta_1X_1+\beta_2X_2+\epsilon`,String.raw`가법 모형에서 다른 변수를 고정한 채 $X_1$이 한 단위 증가하면 평균 $Y$는 $\beta_1$만큼 변한다. 이 변화량은 $X_2$의 값과 무관하다. 이 제한을 풀려면 두 변수의 곱 $X_1X_2$를 새로운 예측변수로 추가한다.`,String.raw`\begin{aligned}Y&=\beta_0+\beta_1X_1+\beta_2X_2+\beta_3X_1X_2+\epsilon\\&=\beta_0+(\beta_1+\beta_3X_2)X_1+\beta_2X_2+\epsilon\end{aligned}`,String.raw`\operatorname{sales}=\beta_0+\beta_1\operatorname{TV}+\beta_2\operatorname{radio}+\beta_3(\operatorname{TV}\times\operatorname{radio})+\epsilon`,String.raw`상호작용 모형은 주효과만 포함한 모형보다 훨씬 잘 맞고, 상호작용 항의 매우 작은 p-value는 $H_0:\beta_3=0$을 기각할 강한 근거를 제공한다. $R^2$도 가법 모형의 $89.7\%$에서 $96.8\%$로 증가한다.`,String.raw`\frac{96.8-89.7}{100-89.7}=\frac{7.1}{10.3}\approx0.689`,String.raw`\operatorname{balance}=\beta_0+\beta_1\operatorname{income}+\beta_2\operatorname{student}+\epsilon`,String.raw`\operatorname{balance}=\beta_0+\beta_1\operatorname{income}+\beta_2\operatorname{student}+\beta_3(\operatorname{income}\times\operatorname{student})+\epsilon`,String.raw`\operatorname{mpg}=\beta_0+\beta_1\operatorname{horsepower}+\beta_2\operatorname{horsepower}^2+\epsilon`,String.raw`이 식은 horsepower의 비선형 함수이지만 계수 $\beta_0,\beta_1,\beta_2$에는 선형이므로 여전히 선형회귀모형이다. $X_1=\operatorname{horsepower}$, $X_2=\operatorname{horsepower}^2$로 놓은 다중선형회귀로 적합할 수 있다.`,String.raw`이차 적합의 $R^2$는 $0.688$로 선형 적합의 $0.606$보다 높고, 이차항의 p-value도 매우 작다. 다만 차수를 높이면 훈련 RSS는 감소하거나 같아지므로 훈련 적합도만으로 차수를 정하면 안 된다. 불필요한 고차항은 곡선을 지나치게 구불구불하게 만들어 새 데이터에서 과적합을 일으킬 수 있으므로 검증 데이터나 교차검증으로 차수를 선택한다.`,String.raw`잔차 그래프(residual plot)는 비선형성을 찾는 유용한 도구다. 단순선형회귀에서는 잔차 $e_i=y_i-\hat{y}_i$를 예측변수 $x_i$에 대해 그리고, 다중회귀에서는 예측변수가 여러 개이므로 잔차를 적합값 $\hat{y}_i$에 대해 그린다.`,String.raw`e_i=y_i-\hat{y}_i`,String.raw`표준 선형회귀는 서로 다른 관측의 오차항 $\epsilon_1,\epsilon_2,\ldots,\epsilon_n$이 무상관이라고 가정한다. 오차항이 양의 상관을 가지면 데이터가 제공하는 독립 정보량이 겉보기의 $n$보다 작아지고, 독립성을 가정해 계산한 표준오차는 실제보다 작아질 수 있다. 그 결과 신뢰구간이 지나치게 좁고 p-value가 지나치게 작아져 유의성을 과장할 수 있다.`,String.raw`\operatorname{SE}(\hat\beta_1)=\frac{\sigma}{\sqrt{n}\,s_x}`,String.raw`\hat\sigma^2=\frac{\sum_{i=1}^{n}e_i^2}{n-k}`,String.raw`표준 선형회귀의 또 다른 가정은 $\operatorname{Var}(\epsilon_i)=\sigma^2$이 모든 관측에서 일정하다는 것이다. 오차분산이 반응 또는 적합값의 크기에 따라 달라지는 이분산성(heteroscedasticity)이 있으면 보통 잔차 그래프에 깔때기 모양이 나타난다.`,String.raw`오른쪽처럼 반응변수에 $\log Y$ 변환을 적용하면 약간의 비선형성은 남아 있어도 분산이 더 일정해질 수 있다. 이분산성 아래에서도 계수 추정은 가능하지만, 고전적 표준오차·신뢰구간·가설검정은 부정확할 수 있으므로 변환, 이분산-견고 표준오차 또는 가중최소제곱을 고려한다.`,String.raw`w_i\propto\frac{1}{\operatorname{Var}(\epsilon_i)}`,String.raw`가중최소제곱(weighted least squares)은 분산이 작은 관측에 더 큰 가중치를 준다. 예를 들어 각 관측이 $n_i$개의 같은 분산을 가진 측정값의 평균이고 $\operatorname{Var}(\epsilon_i)\propto1/n_i$라면 $w_i=n_i$로 둘 수 있다. 대부분의 선형회귀 소프트웨어는 관측 가중치를 지원한다.`,String.raw`이상점(outlier)은 주어진 예측변수 $x_i$에 비해 반응값 $y_i$가 모형의 예측에서 크게 벗어난 관측이다.`,String.raw`r_i=\frac{e_i}{\hat\sigma\sqrt{1-h_i}}`,String.raw`이상점이 주어진 $x_i$에서 특이한 $y_i$를 갖는 관측이라면, 높은 지렛값(high leverage)을 갖는 관측은 예측변수 $x_i$ 자체가 다른 관측들과 멀리 떨어져 있다. 이런 점은 최소제곱선에 큰 영향을 줄 수 있다.`,String.raw`h_i=\frac{1}{n}+\frac{(x_i-\bar{x})^2}{\sum_{j=1}^{n}(x_j-\bar{x})^2}`,String.raw`단순선형회귀에서 $h_i$는 $x_i$가 $\bar{x}$에서 멀수록 증가하며 $1/n$과 1 사이의 값을 갖는다. 절편을 포함하고 예측변수가 $p$개인 모형에서 평균 지렛값은 $(p+1)/n$이므로, 이를 크게 초과하는 관측을 높은 지렛값 후보로 본다. 오른쪽 진단 그래프에서 41번 관측은 지렛값과 스튜던트화 잔차가 모두 커서 높은 지렛값을 갖는 동시에 이상점이기도 하다.`,String.raw`공선성은 $\hat\beta_j$의 표준오차를 키운다. 다른 조건이 같다면 $t=\hat\beta_j/\operatorname{SE}(\hat\beta_j)$의 절댓값이 작아져 실제로 0이 아닌 계수를 발견하는 검정력(power)이 낮아질 수 있다.`,String.raw`\operatorname{VIF}_j=\frac{1}{1-R_j^2}`,String.raw`여기서 $R_j^2$는 $X_j$를 나머지 모든 예측변수로 회귀했을 때의 결정계수다. VIF의 최솟값은 1이며, 값이 클수록 다른 예측변수 때문에 $\hat\beta_j$의 분산이 많이 팽창했음을 뜻한다. 5 또는 10을 넘으면 문제로 보는 기준이 널리 쓰이지만 절대적인 경계는 아니다.`,String.raw`단순선형회귀(simple linear regression)는 하나의 예측변수 $X$를 이용해 양적 반응변수 $Y$를 예측한다. $X$와 $Y$ 사이의 관계를 선형으로 근사할 수 있다고 가정하면 다음과 같이 쓸 수 있다.`,String.raw`단순선형회귀 모형 $Y\approx\beta_0+\beta_1X$`,String.raw`Y\approx\beta_0+\beta_1X`,String.raw`$\beta_0$는 절편(intercept), $\beta_1$은 기울기(slope)다. 두 값은 모형계수(coefficient) 또는 모수(parameter)라고 부른다.`,String.raw`훈련 데이터로부터 계수 추정값 $\hat\beta_0$와 $\hat\beta_1$을 얻으면 새로운 입력 $x$에 대한 반응값을 예측할 수 있다.`,String.raw`단순선형회귀의 예측식 $\hat y=\hat\beta_0+\hat\beta_1x$`,String.raw`\hat y=\hat\beta_0+\hat\beta_1x`,String.raw`Advertising 데이터에는 $n=200$개의 관측쌍 $(x_1,y_1),(x_2,y_2),\ldots,(x_n,y_n)$이 있다. 목표는 이 관측점들에 가장 잘 맞는 계수 추정값 $\hat\beta_0$와 $\hat\beta_1$을 찾는 것이다.`,String.raw`$i$번째 예측값은 $\hat y_i=\hat\beta_0+\hat\beta_1x_i$이고, 관측값과 예측값의 차이 $e_i=y_i-\hat y_i$를 $i$번째 잔차(residual)라고 한다.`,String.raw`예측값 $\hat y_i$와 잔차 $e_i$의 정의`,String.raw`\hat y_i=\hat\beta_0+\hat\beta_1x_i,\qquad e_i=y_i-\hat y_i`,String.raw`\operatorname{RSS}=e_1^2+e_2^2+\cdots+e_n^2=\sum_{i=1}^{n}(y_i-\hat y_i)^2`,String.raw`최소제곱법은 $\operatorname{RSS}$를 가장 작게 만드는 $\hat\beta_0$와 $\hat\beta_1$을 선택한다. 이 최솟값은 미분을 통해 닫힌 형태로 구할 수 있다.`,String.raw`\hat\beta_1=\frac{\sum_{i=1}^{n}(x_i-\bar x)(y_i-\bar y)}{\sum_{i=1}^{n}(x_i-\bar x)^2},\qquad \hat\beta_0=\bar y-\hat\beta_1\bar x`,String.raw`Advertising 데이터에서 얻은 적합 결과는 $\hat\beta_0=7.03$, $\hat\beta_1=0.0475$다. 따라서 적합된 회귀식은 다음과 같다.`,String.raw`\widehat{\operatorname{Sales}}=7.03+0.0475\,\operatorname{TV}`,String.raw`두 그래프의 빨간 점은 계수 쌍 $(\hat\beta_0,\hat\beta_1)$이 위치한 곳이다. 이 지점에서 $\operatorname{RSS}$가 가장 작아진다.`,String.raw`$X$와 $Y$의 참 관계를 $Y=f(X)+\epsilon$으로 나타내고 $f$를 선형함수로 근사하면, 단순선형회귀의 모집단 모형은 다음과 같다.`,String.raw`모집단 단순선형회귀 모형 $Y=\beta_0+\beta_1X+\epsilon$`,String.raw`Y=\beta_0+\beta_1X+\epsilon`,String.raw`$\beta_0$: $X=0$일 때 $Y$의 조건부 기댓값인 모집단 절편`,String.raw`$\beta_1$: $X$가 한 단위 증가할 때 $Y$의 조건부 평균이 변하는 양인 모집단 기울기`,String.raw`$\epsilon$: 선형식으로 설명하지 못한 변동을 나타내는 오차항. 기본 모형에서는 $\mathbb{E}(\epsilon\mid X)=0$을 가정한다.`,String.raw`모평균 $\mu$를 표본평균 $\hat\mu$로 추정할 때 반복 표집에서 $\mathbb{E}(\hat\mu)=\mu$가 성립하면 $\hat\mu$를 비편향 추정량(unbiased estimator)이라고 한다. 선형모형과 $\mathbb{E}(\epsilon\mid X)=0$ 가정 아래에서는 최소제곱 추정량에도 $\mathbb{E}(\hat\beta_0)=\beta_0$, $\mathbb{E}(\hat\beta_1)=\beta_1$이 성립한다.`,String.raw`\mathbb{E}(\hat\mu)=\mu,\qquad \mathbb{E}(\hat\beta_0)=\beta_0,\qquad \mathbb{E}(\hat\beta_1)=\beta_1`,String.raw`추정량이 참값 주변에서 얼마나 변하는지는 표준오차(SE, standard error)로 측정한다. 서로 독립이고 분산이 $\sigma^2$인 $n$개의 관측값에 대한 표본평균의 표준오차는 다음과 같다.`,String.raw`\operatorname{Var}(\hat\mu)=\operatorname{SE}(\hat\mu)^2=\frac{\sigma^2}{n},\qquad \operatorname{SE}(\hat\mu)=\frac{\sigma}{\sqrt n}`,String.raw`오차항들이 서로 비상관이고 모두 같은 분산 $\sigma^2=\operatorname{Var}(\epsilon)$을 가지며 평균이 0이라고 가정하면, 최소제곱 계수 추정량의 표준오차는 다음과 같다.`,String.raw`\operatorname{SE}(\hat\beta_0)^2=\sigma^2\left[\frac{1}{n}+\frac{\bar x^2}{\sum_{i=1}^{n}(x_i-\bar x)^2}\right],\qquad \operatorname{SE}(\hat\beta_1)^2=\frac{\sigma^2}{\sum_{i=1}^{n}(x_i-\bar x)^2}`,String.raw`다른 조건이 같다면 $x_i$들이 표본평균 $\bar x$를 중심으로 넓게 퍼져 있을수록 $\operatorname{SE}(\hat\beta_1)$은 작아진다. 좁은 구간에 몰린 입력만으로는 전체적인 선형 패턴과 넓은 범위에서의 예측을 정확히 추정하기 어렵다.`,String.raw`일반적으로 $\sigma^2$은 알 수 없으므로 데이터로 추정한다. $\sigma$의 추정값인 잔차표준오차(RSE, residual standard error)는 $\operatorname{RSE}=\sqrt{\operatorname{RSS}/(n-2)}$다. 두 개의 회귀계수를 추정했기 때문에 자유도는 $n-2$가 된다.`,String.raw`기울기 $\beta_1$의 95% 신뢰구간`,String.raw`\hat\beta_1\pm t_{0.975,\,n-2}\operatorname{SE}(\hat\beta_1)`,String.raw`절편 $\beta_0$의 95% 신뢰구간`,String.raw`\hat\beta_0\pm t_{0.975,\,n-2}\operatorname{SE}(\hat\beta_0)`,String.raw`Advertising 데이터에서 $\beta_1$의 95% 신뢰구간이 $[0.042,0.053]$이라면, TV 광고 예산이 1,000달러 늘 때 평균 판매량의 연관된 증가량이 42개에서 53개 사이인 것으로 95% 신뢰한다는 뜻이다.`,String.raw`예측변수 $X$와 반응변수 $Y$ 사이에 선형 연관성이 있는지를 확인하는 가장 일반적인 검정은 다음 두 가설을 비교한다.`,String.raw`H_0:\beta_1=0\qquad\text{versus}\qquad H_1:\beta_1\ne0`,String.raw`$H_0$가 참이면 모집단 모형은 $Y=\beta_0+\epsilon$으로 줄어든다. 검정의 목적은 $\hat\beta_1$이 0과 얼마나 다른지를 그 표준오차와 비교해 $H_0$에 반하는 증거의 크기를 평가하는 것이다.`,String.raw`$\operatorname{SE}(\hat\beta_1)$이 작으면 비교적 작은 $|\hat\beta_1|$도 큰 검정통계량을 만들 수 있다. 반대로 표준오차가 크면 $H_0$를 기각하기 위해 더 큰 $|\hat\beta_1|$이 필요하다.`,String.raw`t=\frac{\hat\beta_1-0}{\operatorname{SE}(\hat\beta_1)}`,String.raw`정규오차 가정 아래 $H_0$가 참이면 이 통계량은 자유도 $n-2$의 $t$-분포를 따른다. 큰 표본에서는 표준정규분포와 매우 비슷하다. 예를 들어 $n=200$인 양측 5% 검정의 임계값은 약 $t_{0.975,198}=1.972$이므로, 관측된 $|t|=2.3$은 이 임계값을 넘어 $H_0$를 기각한다.`,String.raw`p=\Pr_{H_0}\!\left(|T|\ge |t_{\mathrm{obs}}|\right)`,String.raw`Advertising 데이터에서는 $\hat\beta_1$이 그 표준오차에 비해 매우 커서 $t$-통계량의 절댓값이 크고 p-value는 매우 작다. 따라서 TV 광고 예산과 판매량 사이에 선형 연관성이 없다는 $H_0:\beta_1=0$에 강한 반대 증거가 있다. 절편의 유의성은 이 연관성 판단과 별개의 문제다.`,String.raw`선형회귀 모형이 데이터에 얼마나 잘 맞는지는 서로 관련된 두 수량인 잔차표준오차(RSE)와 $R^2$ 통계량으로 평가할 수 있다.`,String.raw`회귀모형의 적합도를 평가하는 RSE와 $R^2$`,String.raw`RSE는 모집단 모형 $Y=f(X)+\epsilon$에서 오차항 $\epsilon$의 표준편차 $\sigma$를 추정한다. 즉 관측값이 적합된 회귀선에서 보통 어느 정도 떨어져 있는지를 반응변수의 단위로 나타낸다.`,String.raw`\operatorname{RSE}=\sqrt{\frac{1}{n-2}\operatorname{RSS}}=\sqrt{\frac{1}{n-2}\sum_{i=1}^{n}(y_i-\hat y_i)^2}`,String.raw`RSE는 $Y$의 단위에 의존한다. 반면 $R^2$은 $Y$의 전체 변동 가운데 회귀모형이 설명한 비율을 $0$과 $1$ 사이의 값으로 나타내므로 단위에 의존하지 않는다.`,String.raw`결정계수 $R^2$의 정의`,String.raw`\operatorname{TSS}=\sum_{i=1}^{n}(y_i-\bar y)^2,\qquad R^2=\frac{\operatorname{TSS}-\operatorname{RSS}}{\operatorname{TSS}}=1-\frac{\operatorname{RSS}}{\operatorname{TSS}}`,String.raw`$\operatorname{TSS}$: 회귀모형을 적합하기 전 $Y$에 존재하는 전체 변동량`,String.raw`$\operatorname{RSS}$: 회귀모형을 적합한 뒤에도 설명되지 않은 변동량`,String.raw`$\operatorname{TSS}-\operatorname{RSS}$: 회귀모형이 설명한 변동량`,String.raw`$R^2$이 1에 가까울수록 표본에서 관측된 $Y$의 변동 중 선형회귀로 설명되는 비율이 크다. 0에 가깝다면 선형 신호가 약하거나 잡음이 크거나, $X$의 관측 범위가 좁거나, 관계가 선형이 아닐 수 있다. 낮은 $R^2$만으로 모형이 반드시 잘못되었다고 단정할 수는 없다.`,String.raw`Advertising 예제의 $R^2=0.61$은 TV 광고 예산을 이용한 회귀선이 Sales의 표본 변동 중 약 61%를 설명한다는 뜻이다. 어느 정도의 $R^2$을 좋은 값으로 볼지는 측정 오차와 연구 목적, 적용 분야에 따라 달라진다.`,String.raw`절편을 포함한 단순선형회귀에서의 $R^2$과 표본 상관계수 관계`,String.raw`r=\operatorname{Cor}(X,Y)=\frac{\sum_{i=1}^{n}(x_i-\bar x)(y_i-\bar y)}{\sqrt{\sum_{i=1}^{n}(x_i-\bar x)^2}\sqrt{\sum_{i=1}^{n}(y_i-\bar y)^2}},\qquad R^2=r^2`,String.raw`표본 상관계수 $r$은 두 변수 사이의 선형 연관성의 방향과 강도를 나타낸다. 절편을 포함한 단순최소제곱회귀에서는 대수적으로 $R^2=r^2$이 성립한다. 이는 실제 모집단 관계가 반드시 선형이라는 뜻은 아니며, 여러 예측변수를 사용하는 다중회귀에서는 단일 상관계수의 제곱으로 일반화되지 않는다.`;String.raw`로지스틱 회귀는 $\Pr(Y=k\mid X=x)$를 직접 모형화하는 판별적(discriminative) 접근이다. 생성적(generative) 접근은 반대로 각 부류에서 $X$가 어떤 분포를 따르는지를 먼저 모형화한 뒤, 베이즈 정리로 사후확률을 구한다.`,String.raw`$\pi_k=\Pr(Y=k)$를 $k$번째 부류의 사전확률(prior probability), $f_k(x)=p(X=x\mid Y=k)$를 $k$번째 부류에서의 클래스 조건부 밀도라고 하자. 연속형 $X$에서 $f_k(x)$는 한 점의 확률이 아니라 밀도다.`,String.raw`p_k(x)=\Pr(Y=k\mid X=x)=\frac{\pi_k f_k(x)}{\sum_{\ell=1}^{K}\pi_\ell f_\ell(x)}`,String.raw`$p=1$일 때 LDA(linear discriminant analysis)는 각 부류의 $X$가 평균 $\mu_k$와 모든 부류에 공통인 분산 $\sigma^2$을 갖는 정규분포를 따른다고 가정한다.`,String.raw`f_k(x)=\frac{1}{\sqrt{2\pi}\sigma}\exp\!\left[-\frac{(x-\mu_k)^2}{2\sigma^2}\right]`,String.raw`\delta_k(x)=x\frac{\mu_k}{\sigma^2}-\frac{\mu_k^2}{2\sigma^2}+\log\pi_k`,String.raw`\delta_1(x)=\delta_2(x)`,String.raw`실제로는 $\pi_k$, $\mu_k$, $\sigma^2$을 모르므로 훈련 데이터에서 추정한다. $n_k$는 k번째 부류의 훈련 관측 수다.`,String.raw`\hat\mu_k=\frac{1}{n_k}\sum_{i:y_i=k}x_i,\qquad \hat\sigma^2=\frac{1}{n-K}\sum_{k=1}^{K}\sum_{i:y_i=k}(x_i-\hat\mu_k)^2`,String.raw`\hat\pi_k=\frac{n_k}{n}`,String.raw`$p>1$이면 LDA는 각 부류의 관측이 부류별 평균벡터 $\mu_k$와 모든 부류에 공통인 공분산행렬 $\Sigma$를 갖는 다변량 정규분포를 따른다고 가정한다.`,String.raw`그림의 왼쪽은 $\operatorname{Var}(X_1)=\operatorname{Var}(X_2)$, $\operatorname{Cor}(X_1,X_2)=0$이고, 오른쪽은 $\operatorname{Cor}(X_1,X_2)=0.7$이다. 두 경우 모두 각 변수의 주변분포는 정규분포다.`,String.raw`f(x)=\frac{1}{(2\pi)^{p/2}|\Sigma|^{1/2}}\exp\!\left[-\frac{1}{2}(x-\mu)^\top\Sigma^{-1}(x-\mu)\right]`,String.raw`$X\mid Y=k\sim N(\mu_k,\Sigma)$를 베이즈 정리에 대입하고 부류에 공통인 항을 제거하면 다음 판별함수를 얻는다.`,String.raw`\delta_k(x)=x^\top\Sigma^{-1}\mu_k-\frac{1}{2}\mu_k^\top\Sigma^{-1}\mu_k+\log\pi_k`,String.raw`\operatorname{Sensitivity}=\frac{TP}{TP+FN},\qquad \operatorname{Specificity}=\frac{TN}{TN+FP}`,String.raw`\operatorname{TPR}=\frac{TP}{TP+FN},\qquad \operatorname{FPR}=\frac{FP}{FP+TN}=1-\operatorname{Specificity}`,String.raw`QDA(quadratic discriminant analysis)도 $X\mid Y=k$가 다변량 정규분포를 따른다고 가정하지만, LDA와 달리 각 부류가 자신의 공분산행렬 $\Sigma_k$를 갖는다고 가정한다.`,String.raw`\delta_k(x)=-\frac{1}{2}(x-\mu_k)^\top\Sigma_k^{-1}(x-\mu_k)-\frac{1}{2}\log|\Sigma_k|+\log\pi_k`,String.raw`$p$개 변수의 공분산행렬에는 $p(p+1)/2$개의 서로 다른 매개변수가 있다. LDA는 이 행렬을 하나만 추정하지만 QDA는 K개를 추정해야 하므로 더 유연하고 분산도 더 크다.`,String.raw`f_k(x)=\prod_{j=1}^{p}f_{kj}(x_j)`,String.raw`\Pr(Y=k\mid X=x)=\frac{\pi_k\prod_{j=1}^{p}f_{kj}(x_j)}{\sum_{\ell=1}^{K}\pi_\ell\prod_{j=1}^{p}f_{\ell j}(x_j)}`,String.raw`양적 $X_j$에 정규분포를 가정해 $X_j\mid Y=k\sim N(\mu_{jk},\sigma^2_{jk})$로 추정할 수 있다.`,String.raw`예측변수가 세 개이고 부류가 두 개인 예에서 $\hat\pi_1=\hat\pi_2=0.5$라고 하자. 새 관측 $x^*=(0.4,1.5,1)^\top$의 변수별 밀도를 읽고 곱하면 부류별 사후확률을 얻는다.`,String.raw`\Pr(Y=1\mid X=x^*)=0.944,\qquad \Pr(Y=2\mid X=x^*)=0.056`;String.raw`Y=\begin{cases}0,&\text{뇌졸중}\\1,&\text{약물 남용}\end{cases},\qquad \widehat{p}(X)>0.5\Rightarrow \widehat{Y}=1`,String.raw`로지스틱 회귀(logistic regression)는 반응변수를 직접 예측하기보다, 입력 $X=x$가 주어졌을 때 $Y=1$인 조건부 확률 $p(x)=\Pr(Y=1\mid X=x)$를 모형화한다.`,String.raw`p(X)=\beta_0+\beta_1X`,String.raw`p(X)=\frac{e^{\beta_0+\beta_1X}}{1+e^{\beta_0+\beta_1X}}=\frac{1}{1+e^{-(\beta_0+\beta_1X)}}`,String.raw`확률 $p(X)$를 오즈(odds) $p(X)/(1-p(X))$로 바꾸면 범위가 $0$에서 $\infty$까지로 넓어진다. 오즈가 1이면 확률은 0.5이고, 오즈가 매우 클수록 확률은 1에 가까워진다.`,String.raw`\frac{p(X)}{1-p(X)}=e^{\beta_0+\beta_1X}`,String.raw`\operatorname{logit}(p(X))=\log\!\left(\frac{p(X)}{1-p(X)}\right)=\beta_0+\beta_1X`,String.raw`$X$가 1단위 증가하면 로그 오즈는 $\beta_1$만큼 변하고, 오즈는 $e^{\beta_1}$배가 된다. 계수를 확률의 일정한 증가량으로 바로 해석해서는 안 된다.`,String.raw`\ell(\beta_0,\beta_1)=\prod_{i:y_i=1}p(x_i)\prod_{i:y_i=0}\bigl(1-p(x_i)\bigr)`,String.raw`적합 결과 $\hat\beta_1=0.0055$라면 balance가 1단위 커질 때 default 로그 오즈가 0.0055만큼 커지고, 오즈는 $e^{0.0055}$배가 된다.`,String.raw`\hat p(1000)=\frac{e^{\hat\beta_0+1000\hat\beta_1}}{1+e^{\hat\beta_0+1000\hat\beta_1}}\approx0.0058`,String.raw`\log\!\left(\frac{p(X)}{1-p(X)}\right)=\beta_0+\beta_1X_1+\cdots+\beta_pX_p`,String.raw`p(X)=\frac{e^{\beta_0+\sum_{j=1}^{p}\beta_jX_j}}{1+e^{\beta_0+\sum_{j=1}^{p}\beta_jX_j}}`,String.raw`반응변수에 $K>2$개의 범주가 있으면 다항 로지스틱 회귀(multinomial logistic regression)를 사용할 수 있다. 한 범주를 기준범주로 정하고 나머지 각 범주의 로그 오즈를 기준범주와 비교한다.`,String.raw`\Pr(Y=k\mid X=x)=\frac{e^{\beta_{k0}+\sum_{j=1}^{p}\beta_{kj}x_j}}{1+\sum_{\ell=1}^{K-1}e^{\beta_{\ell0}+\sum_{j=1}^{p}\beta_{\ell j}x_j}},\quad k=1,\ldots,K-1`,String.raw`\Pr(Y=K\mid X=x)=\frac{1}{1+\sum_{\ell=1}^{K-1}e^{\beta_{\ell0}+\sum_{j=1}^{p}\beta_{\ell j}x_j}}`,String.raw`\log\!\left(\frac{\Pr(Y=k\mid X=x)}{\Pr(Y=K\mid X=x)}\right)=\beta_{k0}+\sum_{j=1}^{p}\beta_{kj}x_j`,String.raw`\operatorname{Var}\!\left(\alpha X+(1-\alpha)Y\right)=\alpha^2\sigma_X^2+(1-\alpha)^2\sigma_Y^2+2\alpha(1-\alpha)\sigma_{XY}`,String.raw`\alpha^*=\frac{\sigma_Y^2-\sigma_{XY}}{\sigma_X^2+\sigma_Y^2-2\sigma_{XY}}`,String.raw`\widehat{\alpha}=\frac{\widehat{\sigma}_Y^2-\widehat{\sigma}_{XY}}{\widehat{\sigma}_X^2+\widehat{\sigma}_Y^2-2\widehat{\sigma}_{XY}}`,String.raw`왼쪽은 모집단에서 1,000개의 독립 데이터셋을 생성해 얻은 α 추정값의 분포다. 모집단 모수를 $\sigma_X^2=1$, $\sigma_Y^2=1.25$, $\sigma_{XY}=0.5$로 두면 참값은 $\alpha=0.6$이다.`,String.raw`$SE(\widehat{\alpha})\approx0.083$이라는 값은 추정값의 평균과 참값이 그만큼 차이 난다는 뜻이 아니다. 같은 크기의 표본을 반복해서 얻을 때 $\widehat{\alpha}$가 보이는 전형적인 변동 규모를 뜻한다.`,String.raw`$Z^{*1}$에서 관심 통계량 $\widehat{\alpha}^{*1}$을 계산한다.`,String.raw`이 과정을 B번 반복해 $\widehat{\alpha}^{*1},\ldots,\widehat{\alpha}^{*B}$를 얻는다.`,String.raw`\widehat{SE}_{B}(\widehat{\alpha})=\sqrt{\frac{1}{B-1}\sum_{r=1}^{B}\left(\widehat{\alpha}^{*r}-\overline{\widehat{\alpha}^{*}}\right)^2}`,String.raw`Z_m=\sum_{j=1}^{p}\phi_{jm}X_j,\qquad m=1,\ldots,M,\quad M<p`,String.raw`Y=\theta_0+\sum_{m=1}^{M}\theta_mZ_m+\epsilon`,String.raw`\beta_j=\sum_{m=1}^{M}\theta_m\phi_{jm}`,String.raw`Z_1=0.839\,(\mathrm{pop}-\overline{\mathrm{pop}})+0.544\,(\mathrm{ad}-\overline{\mathrm{ad}})`,String.raw`\sum_{j=1}^{p}\phi_{j1}^{2}=1`,String.raw`\max_{\boldsymbol\phi_1}\left\{\frac{1}{n}\sum_{i=1}^{n}\left(\sum_{j=1}^{p}\phi_{j1}x_{ij}\right)^2\right\}\quad\text{subject to}\quad\sum_{j=1}^{p}\phi_{j1}^2=1`,String.raw`Z_2=-0.544\,(\mathrm{pop}-\overline{\mathrm{pop}})+0.839\,(\mathrm{ad}-\overline{\mathrm{ad}})`,String.raw`Z_1=\sum_{j=1}^{p}\phi_{j1}X_j,\qquad \phi_{j1}\propto \operatorname{Cov}(X_j,Y)`,String.raw`Y=\beta_0+\sum_{j=1}^{p}\beta_jX_j+\epsilon`,String.raw`\sum_{k=0}^{p}{p\choose k}=2^p`,String.raw`각 $k=1,\ldots,p$에 대해 $\binom{p}{k}$개 모형을 적합하고 RSS가 가장 작은 $M_k$를 선택한다.`,String.raw`1+p+(p-1)+\cdots+1=1+\frac{p(p+1)}{2}`,String.raw`C_p=\frac{1}{n}\left(RSS+2d\widehat{\sigma}^{2}\right)`,String.raw`AIC=\frac{RSS}{n\widehat{\sigma}^{2}}+\frac{2d}{n}`,String.raw`BIC=\frac{RSS}{n\widehat{\sigma}^{2}}+\frac{d\log n}{n}`,String.raw`R^2_{\mathrm{adj}}=1-\frac{RSS/(n-d-1)}{TSS/(n-1)}`,String.raw`\widehat{\boldsymbol\beta}^{\mathrm{ridge}}=\arg\min_{\beta_0,\boldsymbol\beta}\left\{\sum_{i=1}^{n}\left(y_i-\beta_0-\sum_{j=1}^{p}\beta_jx_{ij}\right)^2+\lambda\sum_{j=1}^{p}\beta_j^2\right\}`,String.raw`\widetilde{x}_{ij}=\frac{x_{ij}-\bar{x}_j}{\sqrt{\frac{1}{n}\sum_{i=1}^{n}(x_{ij}-\bar{x}_j)^2}}`,String.raw`\widehat{\boldsymbol\beta}^{\mathrm{lasso}}=\arg\min_{\beta_0,\boldsymbol\beta}\left\{\sum_{i=1}^{n}\left(y_i-\beta_0-\sum_{j=1}^{p}\beta_jx_{ij}\right)^2+\lambda\sum_{j=1}^{p}|\beta_j|\right\}`,String.raw`\begin{aligned}\text{Ridge: }&\min RSS &&\text{subject to }\sum_{j=1}^{p}\beta_j^2\le s,\\\text{Lasso: }&\min RSS &&\text{subject to }\sum_{j=1}^{p}|\beta_j|\le s.\end{aligned}`,String.raw`\min RSS\quad\text{subject to}\quad\sum_{j=1}^{p}I(\beta_j\ne0)\le s`,String.raw`\widehat\beta_j^{\mathrm{ridge}}=\frac{\widehat\beta_j}{1+\lambda}`,String.raw`\widehat\beta_j^{\mathrm{lasso}}=\operatorname{sign}(\widehat\beta_j)\left(|\widehat\beta_j|-\lambda/2\right)_+`,String.raw`p(\boldsymbol\beta\mid X,Y)\propto f(Y\mid X,\boldsymbol\beta)\,p(\boldsymbol\beta)`,String.raw`Y_i=\beta_0+\beta_1X_i+\epsilon_i`,String.raw`Y_i=\beta_0+\beta_1X_i+\beta_2X_i^2+\cdots+\beta_dX_i^d+\epsilon_i`,String.raw`\widehat{Y}_i=\widehat\beta_0+\widehat\beta_1X_i+\widehat\beta_2X_i^2+\widehat\beta_3X_i^3+\widehat\beta_4X_i^4`,String.raw`\Pr(Y_i>250\mid X_i=x_i)=\frac{\exp\!\left(\beta_0+\beta_1x_i+\cdots+\beta_4x_i^4\right)}{1+\exp\!\left(\beta_0+\beta_1x_i+\cdots+\beta_4x_i^4\right)}`,String.raw`C_0(X)=I(X<c_1),\quad C_1(X)=I(c_1\le X<c_2),\quad\ldots,\quad C_K(X)=I(c_K\le X)`,String.raw`\sum_{j=0}^{K}C_j(X)=1`,String.raw`Y_i=\beta_0+\beta_1C_1(X_i)+\cdots+\beta_KC_K(X_i)+\epsilon_i`,String.raw`Y_i=\beta_0+\sum_{j=1}^{K}\beta_j b_j(X_i)+\epsilon_i`,String.raw`Y_i=\beta_0+\beta_1X_i+\beta_2X_i^2+\beta_3X_i^3+\epsilon_i`,String.raw`Y_i=\begin{cases}\beta_{01}+\beta_{11}X_i+\beta_{21}X_i^2+\beta_{31}X_i^3+\epsilon_i,&X_i<c,\\[2pt]\beta_{02}+\beta_{12}X_i+\beta_{22}X_i^2+\beta_{32}X_i^3+\epsilon_i,&X_i\ge c.\end{cases}`,String.raw`Y_i=\beta_0+\beta_1X_i+\beta_2X_i^2+\beta_3X_i^3+\sum_{k=1}^{K}\theta_k h(X_i,\xi_k)+\epsilon_i`,String.raw`h(x,\xi)=(x-\xi)_+^3=\begin{cases}(x-\xi)^3,&x>\xi,\\0,&x\le\xi.\end{cases}`,String.raw`\underset{g}{\operatorname{minimize}}\left\{\sum_{i=1}^{n}\bigl(y_i-g(x_i)\bigr)^2+\lambda\int g''(t)^2\,dt\right\}`,String.raw`\min_{\beta_0,\beta_1}\sum_{i=1}^{n}K_{i0}\bigl(y_i-\beta_0-\beta_1x_i\bigr)^2`,String.raw`Y_i=\beta_0+\beta_1X_{i1}+\cdots+\beta_pX_{ip}+\epsilon_i`,String.raw`Y_i=\beta_0+f_1(X_{i1})+f_2(X_{i2})+\cdots+f_p(X_{ip})+\epsilon_i`,String.raw`p(r\mid N,f)=\binom{N}{r}f^r(1-f)^{N-r}=\frac{N!}{r!(N-r)!}f^r(1-f)^{N-r}`,String.raw`r=\sum_{i=1}^{N}r_i,\qquad \mathbb E[r_i]=f,\qquad \mathbb E[r]=\sum_{i=1}^{N}\mathbb E[r_i]=Nf`,String.raw`\mathbb E[r^2]=Nf+N(N-1)f^2`,String.raw`\operatorname{Var}(r)=\mathbb E[r^2]-\mathbb E[r]^2=Nf(1-f)`,String.raw`N\to\infty,\quad f\to0,\quad Nf=\lambda\qquad\Longrightarrow\qquad P(r\mid\lambda)=e^{-\lambda}\frac{\lambda^r}{r!}`,String.raw`\mathbb E[r]=\lambda,\qquad \operatorname{Var}(r)=\lambda`,String.raw`e^{-\lambda}\frac{\lambda^r}{r!}\approx\frac{1}{\sqrt{2\pi\lambda}}\exp\!\left[-\frac{(r-\lambda)^2}{2\lambda}\right]`,String.raw`\lambda!\approx\sqrt{2\pi\lambda}\left(\frac{\lambda}{e}\right)^{\lambda}`,String.raw`\log(\lambda!)\approx\lambda\log\lambda-\lambda+\frac12\log(2\pi\lambda)`,String.raw`\log\binom Nr\approx N\log N-r\log r-(N-r)\log(N-r)=NH_2\!\left(\frac rN\right)`,String.raw`H_2(p)=-p\log p-(1-p)\log(1-p)`,String.raw`P(r\mid N,f)\approx e^{NH_2(r/N)}f^r(1-f)^{N-r}`,String.raw`H(X)=-\sum_{x\in\mathcal A_X}p(x)\log_2 p(x)`,String.raw`X=(\mathcal A_X,P_X),\qquad \mathcal A_X=\{a_1,\ldots,a_K\},\qquad P_X(a_j)=p_j,\quad\sum_{j=1}^Kp_j=1`,String.raw`P_X(x)=\sum_yP_{X,Y}(x,y),\qquad p_X(x)=\int p_{X,Y}(x,y)\,dy`,String.raw`p(\mathcal D\mid\mathcal M)=\int p(\mathcal D\mid w,\mathcal M)p(w\mid\mathcal M)\,dw`,String.raw`p(w\mid\mathcal D,\mathcal M)=\frac{p(\mathcal D\mid w,\mathcal M)p(w\mid\mathcal M)}{p(\mathcal D\mid\mathcal M)}`,String.raw`P(n_B\mid N,f)=\binom N{n_B}f^{n_B}(1-f)^{N-n_B}`,String.raw`P(u\mid n_B,N)=\frac{P(n_B\mid u,N)P(u)}{\sum_{u'}P(n_B\mid u',N)P(u')}`,String.raw`p(f\mid n,N)\propto f^n(1-f)^{N-n}`,String.raw`p(f\mid n,N)=(N+1)\binom Nn f^n(1-f)^{N-n}`,String.raw`P(x_{N+1}=1\mid n,N)=\int_0^1 f\,p(f\mid n,N)\,df=\frac{n+1}{N+2}`,String.raw`\widehat f_{\mathrm{MLE}}=\widehat f_{\mathrm{MAP}}=\frac nN,\qquad \mathbb E[f\mid n,N]=\frac{n+1}{N+2}`,String.raw`\frac{n+1}{N+2}-\frac nN=\frac{N-2n}{N(N+2)}`,String.raw`B(a,b)=\int_0^1t^{a-1}(1-t)^{b-1}\,dt=\frac{\Gamma(a)\Gamma(b)}{\Gamma(a+b)}`,String.raw`\Gamma(a)=\int_0^\infty x^{a-1}e^{-x}\,dx,\qquad \Gamma(n+1)=n!`,String.raw`\Gamma(n+1)\Gamma(m+1)=\Gamma(n+m+2)\int_0^1t^n(1-t)^m\,dt`,String.raw`B(n+1,m+1)=\frac{n!m!}{(n+m+1)!}`,String.raw`Z=\binom NnB(n+1,N-n+1)=\frac1{N+1}`;let f={slug:"information-theory-2-noisy-channel",section:"learning",topic:"information-theory",title:"정보이론(2)",summary:"잡음 채널에서 반복 부호와 Hamming 부호가 오류를 줄이는 원리를 살펴보고, KL divergence·Jensen 부등식·ELBO와 세 가지 정보 게임을 연결합니다.",updatedAt:"2026-08-03",originalTitle:"서울시립대학교 「정보이론과 데이터사이언스」 강의 정리 — 황원석 교수",keywords:["정보이론","Noisy Channel","Hamming Code","KL Divergence","Jensen 부등식","ELBO"],body:[{heading:"복습: 이항분포와 엔트로피",paragraphs:[],blocks:[{type:"paragraph",text:"강의 내용을 공부하며 개인적으로 다시 정리한 글이다. 앞 글에서 이항분포의 조합계수에 스털링 근사를 적용하면 긴 비트열의 개수가 엔트로피의 지수 형태로 나타난다는 점을 살펴봤다."},{type:"formula",latex:String.raw`p(r\mid N,f)=\binom Nr f^r(1-f)^{N-r}`,description:"N번 시행에서 성공이 r번 발생하는 이항분포"},{type:"formula",latex:String.raw`\log(\lambda!)\approx\lambda\log\lambda-\lambda+\frac12\log(2\pi\lambda)`,description:"큰 수의 팩토리얼을 로그 합으로 바꾸는 스털링 근사"},{type:"formula",latex:String.raw`H_2(p)=-p\log p-(1-p)\log(1-p),\qquad P(r\mid N,f)\approx e^{NH_2(r/N)}f^r(1-f)^{N-r}`,description:"이진 엔트로피와 이항확률의 지수적 근사"}]},{heading:"잡음 채널",paragraphs:[],blocks:[{type:"paragraph",text:"정보이론에서는 입력 메시지 X가 채널을 통과해 출력 Y가 되는 과정에서 잡음 때문에 결과가 확률적으로 달라질 수 있다고 가정한다. 채널은 조건부 확률 P(Y|X)로 모델링한다."},{type:"formula",latex:String.raw`X\longrightarrow\text{Channel}\longrightarrow Y,\qquad P(Y\mid X)`,description:"입력 X가 확률적 채널을 통과해 출력 Y가 되는 통신 모델"},{type:"formula",latex:String.raw`P(\text{n비트 모두 오류 없음})=(1-\varepsilon)^n`,description:"비트 오류가 독립이고 한 비트의 오류확률이 epsilon일 때 전체 메시지가 보존될 확률"},{type:"paragraph",text:"한 비트의 오류확률 ε가 작아도 메시지가 길어지면 모든 비트가 온전히 도착할 확률은 빠르게 감소한다. 따라서 인코더는 중복을 더하고, 디코더는 손상된 관측으로부터 원래 입력을 복원한다."}]},{heading:"반복 부호와 다수결",paragraphs:[],blocks:[{type:"paragraph",text:"길이 3 반복 부호는 원래 비트 0을 000으로, 1을 111로 보낸다. 수신한 세 비트 중 더 많이 나타난 값을 원래 비트로 추정한다. 예를 들어 000이 001로 손상되어도 0이 두 개이므로 0으로 복원한다."},{type:"paragraph",text:"사전확률이 같고 각 비트가 독립인 이진 대칭 채널에서는 다수결이 최대가능도 추정이자 MAP 추정이 된다. 관측 r=(r_1,r_2,r_3)에 대해 두 source의 사후확률 비를 비교하면 된다."},{type:"formula",latex:String.raw`\mathcal R=\frac{P(s=0\mid r)}{P(s=1\mid r)}=\frac{P(r\mid s=0)P(s=0)}{P(r\mid s=1)P(s=1)}`,description:"관측된 세 비트에서 원래 비트 0과 1의 사후확률을 비교하는 비율"},{type:"formula",latex:String.raw`P(s=0)=P(s=1)=\frac12\quad\Longrightarrow\quad\mathcal R=\left(\frac{\varepsilon}{1-\varepsilon}\right)^{n_1}\left(\frac{1-\varepsilon}{\varepsilon}\right)^{3-n_1}`,description:"관측된 1의 개수 n_1로 표현한 길이 3 반복 부호의 likelihood ratio"},{type:"paragraph",text:"ε<1/2이면 n_1이 0 또는 1일 때 R>1이므로 0을, n_1이 2 또는 3일 때 R<1이므로 1을 고른다. 즉 다수결과 같은 규칙이다."},{type:"formula",latex:String.raw`P(\text{복호 실패})=\binom32\varepsilon^2(1-\varepsilon)+\varepsilon^3=3\varepsilon^2-2\varepsilon^3`,description:"세 비트 중 둘 이상이 뒤집힐 때 발생하는 길이 3 반복 부호의 정확한 실패확률"},{type:"paragraph",text:"반복 횟수를 늘리면 오류확률을 더 줄일 수 있지만 한 정보 비트를 보내는 데 더 많은 채널 사용이 필요하다. 정확도와 전송률 사이의 trade-off가 생긴다."}]},{heading:"베이즈 정리로 읽는 복호",paragraphs:[],blocks:[{type:"list",items:["사전확률(Prior): 관측 전에 source가 나타날 가능성","가능도(Likelihood): 그 source가 맞을 때 현재 관측이 나올 가능성","증거(Evidence): 현재 관측 자체가 나타날 전체 확률","사후확률(Posterior): 관측 후 source가 맞을 확률"]},{type:"formula",latex:String.raw`P(\text{source}\mid\text{observation})=\frac{P(\text{observation}\mid\text{source})P(\text{source})}{P(\text{observation})}`,description:"관측 결과에서 원인을 추론하는 베이즈 정리"},{type:"paragraph",text:"같은 관측에 대해 여러 source 후보를 비교할 때 evidence는 모든 후보에 공통이므로 분자만 비교해도 순위가 같다. 각 후보의 prior와 likelihood를 곱해 가장 큰 후보를 고르는 것이 MAP 복호다."},{type:"quote",text:"복호는 받은 비트열을 가장 잘 설명하는 인코딩 후보를 선택하는 추론 문제로 볼 수 있다."}]},{heading:"Hamming Code(7,4)와 채널 용량",paragraphs:[],blocks:[{type:"paragraph",text:"Hamming(7,4) 부호는 정보 비트 4개에 검사 비트 3개를 추가해 7비트 codeword를 만든다. 검사 비트는 정보 비트들의 mod 2 합으로 구성되며, 수신자는 syndrome으로 한 비트 오류의 위치를 찾아 교정한다."},{type:"image",src:"/content/information-theory-2/figure-01.png",alt:"네 개의 정보 비트와 세 개의 검사 비트로 구성된 Hamming 7,4 부호 설명",caption:"Hamming(7,4)의 정보 비트와 parity bit 구성"},{type:"formula",latex:String.raw`t_5=s_1+s_2+s_3\pmod2`,description:"정보 비트의 mod 2 합으로 만든 검사 비트의 한 예"},{type:"paragraph",text:"표준 Hamming(7,4)은 최소거리가 3이어서 모든 1비트 오류를 교정할 수 있다. 그러나 두 비트 이상이 뒤집히면 일반적인 단일오류 정정 디코더가 올바른 codeword를 보장하지 않는다. 반복 부호와 정확한 실패확률은 서로 같지 않지만, 작은 ε에서 둘 다 실패가 ε² 차수로 시작한다."},{type:"image",src:"/content/information-theory-2/figure-02.png",alt:"반복 부호와 Hamming 부호의 전송 효율 및 오류 교정 성질을 비교한 그림",caption:"같은 중복이라도 부호 구조에 따라 전송률과 교정 능력이 달라진다."},{type:"paragraph",text:"이진 대칭 채널(BSC)의 비트 오류확률이 ε일 때 채널 용량은 한 번의 채널 사용으로 신뢰성 있게 보낼 수 있는 최대 정보율을 뜻한다."},{type:"formula",latex:String.raw`C=1-H_2(\varepsilon)=1+\varepsilon\log_2\varepsilon+(1-\varepsilon)\log_2(1-\varepsilon)`,description:"오류확률 epsilon인 이진 대칭 채널의 용량"},{type:"paragraph",text:"ε=0.1이면 H₂(ε)≈0.469이므로 C≈0.531 bit/use다. 샤넌의 채널 부호화 정리는 전송률이 C보다 낮으면 충분히 긴 좋은 부호를 사용해 오류확률을 임의로 작게 만들 수 있음을 말한다."}]},{heading:"Gibbs 부등식과 KL divergence",paragraphs:[],blocks:[{type:"paragraph",text:"두 확률분포 p와 q의 KL divergence는 음수가 될 수 없다. 같음은 p와 q가 확률 1인 지지집합에서 같을 때 성립한다."},{type:"formula",latex:String.raw`D_{\mathrm{KL}}(p\parallel q)=\sum_i p_i\log\frac{p_i}{q_i}\ge0`,description:"Gibbs 부등식으로 보장되는 KL divergence의 비음수성"},{type:"paragraph",text:"x>0에서 log x≤x-1이므로 -log x≥1-x다. x=q_i/p_i를 대입하고 p_i로 가중합하면 두 확률분포의 합이 각각 1이라는 사실 때문에 우변이 0이 된다."},{type:"formula",latex:String.raw`\sum_i p_i\!\left(-\log\frac{q_i}{p_i}\right)\ge\sum_i p_i\!\left(1-\frac{q_i}{p_i}\right)=\sum_ip_i-\sum_iq_i=0`,description:"로그 부등식으로 KL divergence가 0 이상임을 보이는 증명"}]},{heading:"볼록함수와 Jensen 부등식",paragraphs:[],blocks:[{type:"paragraph",text:"함수 f가 볼록하다는 것은 두 점을 잇는 현이 그래프보다 위에 놓인다는 뜻이다. 두 번 미분 가능한 함수는 구간 전체에서 f''≥0이면 그 구간에서 볼록하다."},{type:"formula",latex:String.raw`f(\lambda x_1+(1-\lambda)x_2)\le\lambda f(x_1)+(1-\lambda)f(x_2),\qquad0\le\lambda\le1`,description:"두 점의 가중평균으로 정의한 볼록함수"},{type:"formula",latex:String.raw`f(x+\Delta x)=f(x)+\Delta x f'(x)+\frac12(\Delta x)^2f''(x)+O((\Delta x)^3)`,description:"곡률과 이차 미분의 관계를 보여 주는 Taylor 전개"},{type:"paragraph",text:"Jensen 부등식은 두 점의 정의를 확률변수 전체의 평균으로 확장한다. 볼록함수에서는 함수값의 평균이 평균에 함수를 적용한 값보다 크거나 같다. 오목함수에서는 부등호가 반대다."},{type:"formula",latex:String.raw`f\text{가 convex이면 }\mathbb E[f(X)]\ge f(\mathbb E[X]);\qquad f\text{가 concave이면 }\mathbb E[f(X)]\le f(\mathbb E[X])`,description:"볼록함수와 오목함수에 대한 Jensen 부등식"},{type:"paragraph",text:"음의 엔트로피는 확률벡터에 대해 볼록하고 엔트로피는 오목하다. 그래서 여러 분포를 섞으면 엔트로피가 각 분포 엔트로피의 평균보다 작아지지 않으며, 같은 지지집합에서는 균등분포가 엔트로피를 최대화한다."}]},{heading:"Evidence Lower Bound(ELBO)",paragraphs:[],blocks:[{type:"paragraph",text:"잠재변수 z가 있는 모델의 evidence p(data)는 적분 때문에 직접 계산하기 어려울 수 있다. 계산하기 쉬운 분포 q(z)를 곱하고 나눈 뒤, 오목함수 log에 Jensen 부등식을 적용하면 evidence의 로그보다 작거나 같은 ELBO를 얻는다."},{type:"formula",latex:String.raw`\log p(x)=\log\mathbb E_{q(z)}\!\left[\frac{p(x,z)}{q(z)}\right]\ge\mathbb E_{q(z)}\!\left[\log\frac{p(x,z)}{q(z)}\right]=\mathcal L(q)`,description:"Jensen 부등식으로 유도한 log evidence의 하한 ELBO"},{type:"formula",latex:String.raw`\mathcal L(q)=\mathbb E_q[\log p(x\mid z)]-D_{\mathrm{KL}}(q(z)\parallel p(z))`,description:"재구성항과 q에서 prior p로의 KL divergence로 분해한 ELBO"},{type:"formula",latex:String.raw`\log p(x)-\mathcal L(q)=D_{\mathrm{KL}}(q(z)\parallel p(z\mid x))\ge0`,description:"ELBO와 log evidence 사이의 간격이 변분분포와 실제 posterior의 KL divergence임을 나타낸 식"},{type:"paragraph",text:"원문의 KL 방향을 바로잡아 쓰면, ELBO의 정규화 항은 D_KL(q(z)||p(z))다. ELBO를 최대화하면 데이터를 잘 설명하는 동시에 q가 prior에서 지나치게 멀어지는 것을 억제한다."}]},{heading:"결합·조건부 엔트로피와 상호정보량",paragraphs:[],blocks:[{type:"formula",latex:String.raw`H(X,Y)=-\sum_{x,y}p(x,y)\log_2p(x,y)`,description:"두 확률변수를 함께 관측할 때의 결합 엔트로피"},{type:"formula",latex:String.raw`H(Y\mid X)=H(X,Y)-H(X)`,description:"X를 알고 난 뒤 Y에 남는 조건부 엔트로피"},{type:"formula",latex:String.raw`I(X;Y)=H(X)+H(Y)-H(X,Y)=D_{\mathrm{KL}}(p(x,y)\parallel p(x)p(y))`,description:"한 변수를 알 때 다른 변수의 불확실성이 얼마나 줄어드는지 나타내는 상호정보량"},{type:"paragraph",text:"정보 압축의 핵심은 예측 가능한 중복을 줄이는 것이다. 상호정보량은 두 변수 사이에 공유된 정보, 즉 한 변수를 알면서 줄어드는 다른 변수의 불확실성을 측정한다."}]},{heading:"세 가지 정보 게임",paragraphs:[],blocks:[{type:"subheading",text:"12개 공의 무게 찾기"},{type:"paragraph",text:"12개 공 중 하나만 무게가 다르고 더 무거운지 가벼운지도 모르면 후보는 24개다. 양팔저울 한 번의 결과는 왼쪽이 무거움, 오른쪽이 무거움, 같음의 세 가지다. 각 측정 뒤 남는 후보가 가능한 한 세 등분되도록 설계하면 세 번의 측정으로 24개 후보를 하나까지 좁힐 수 있다. 3³=27이므로 정보량 관점에서도 가능한 설계다."},{type:"subheading",text:"0부터 63까지 숫자 맞히기"},{type:"paragraph",text:"예·아니오 질문 한 번은 후보를 두 갈래로 나눈다. 매번 절반을 묻는 이진 탐색을 사용하면 64=2⁶개의 균등한 후보 중 하나를 찾는 데 여섯 번이면 충분하다."},{type:"formula",latex:String.raw`\log_2 64=6\ \text{bits}`,description:"64개의 균등한 후보 중 하나를 식별하는 데 필요한 정보량"},{type:"subheading",text:"64칸의 잠수함"},{type:"paragraph",text:"잠수함 위치가 64칸에 균등하게 분포할 때, 최종적으로 특정 칸을 식별한 전체 관측 기록의 자기정보량은 6비트다. 첫 발에 맞힐 사건의 정보량도 -log₂(1/64)=6비트지만, 한 번의 빗나감 자체가 주는 정보량은 -log₂(63/64)로 매우 작다. 매 발마다 항상 6비트를 얻는 것은 아니다."},{type:"formula",latex:String.raw`-\log_2\!\left(\frac{63}{64}\cdot\frac{62}{63}\cdots\frac1{62}\right)=-\log_2\frac1{64}=6\ \text{bits}`,description:"연속된 빗나감과 마지막 명중으로 특정 위치를 식별한 전체 사건의 정보량"},{type:"list",items:["실험 결과가 가능한 한 균등하도록 질문을 설계하면 기대 정보획득량이 커진다.","M개의 균등한 후보를 구분하는 데 필요한 정보량은 log₂M 비트다.","샤넌 엔트로피는 확률이 서로 다른 결과를 평균적으로 구분하는 데 필요한 최소 비트 수와 연결된다."]},{type:"formula",latex:String.raw`H(X)=-\sum_xp(x)\log_2p(x)`,description:"확률분포를 따르는 결과의 평균 정보량인 샤넌 엔트로피"},{type:"paragraph",text:"무손실 압축에서는 모든 원본을 정확히 복원해야 하고, 손실 압축에서는 정해진 왜곡 기준 안에서 일부 정보를 버릴 수 있다. 확률이 높은 기호에는 짧은 코드, 낮은 기호에는 긴 코드를 배정하면 평균 코드 길이를 줄일 수 있다."}]}]};function x(a){return a.replace(/\*\*(.+?)\*\*/g,"$1").replace(/__(.+?)__/g,"$1").trim()}function w(a){return a.trim().replace(/^\|/,"").replace(/\|$/,"").split("|").map(a=>x(a))}function S(a,t={}){let e,r=a.replace(/\r\n?/g,"\n").split("\n"),i=r.flatMap(a=>{let t=/^(#{1,6})\s+(.+)$/.exec(a.trim());return t?[t[1].length]:[]}),n=i.length?Math.min(...i):1,o=[],p=[],s=[],m=!1,g=()=>(e||(e={heading:"개요",paragraphs:[],blocks:[]},o.push(e)),e),l=a=>{let t=g();t.blocks??=[],t.blocks.push(a)},$=()=>{p.length&&(l({type:"paragraph",text:x(p.join(" "))}),p=[])},c=()=>{s.length&&(l({type:"list",items:s,ordered:m||void 0}),s=[])},_=()=>{$(),c()};for(let a=0;a<r.length;a+=1){let i=r[a].trim(),d=/^(#{1,6})\s+(.+)$/.exec(i);if(d){_();let a=d[1].length,r=x(d[2]),i=t.headingReplacements?.[r]??r;a===n?(e={heading:i,paragraphs:[],blocks:[]},o.push(e)):l({type:"subheading",text:i});continue}if(i.startsWith("|")&&a+1<r.length&&function(a){let t=w(a);return t.length>0&&t.every(a=>/^:?-{3,}:?$/.test(a))}(r[a+1])){_();let t=w(i),e=[];for(a+=2;a<r.length&&r[a].trim().startsWith("|");)e.push(w(r[a])),a+=1;a-=1,l({type:"table",headers:t,rows:e,caption:`${g().heading} 표`});continue}let h=function(a){let t=a.trim(),e=(t.match(/\$/g)??[]).length;return t.startsWith("$$")&&t.endsWith("$$")&&4===e?t.slice(2,-2).trim():t.startsWith("$")&&t.endsWith("$")&&2===e?t.slice(1,-1).trim():null}(i);if(h){_(),l({type:"formula",latex:h,description:`${g().heading} 관련 수식`});continue}let u=/^[-*]\s+(.+)$/.exec(i),b=/^\d+[.)]\s+(.+)$/.exec(i);if(u||b){$();let a=!!b;s.length&&m!==a&&c(),m=a,s.push(x((b??u)[1]));continue}if(i.startsWith(">")){_();let t=[x(i.replace(/^>\s?/,""))];for(;a+1<r.length&&r[a+1].trim().startsWith(">");)t.push(x(r[a+=1].trim().replace(/^>\s?/,"")));l({type:"quote",text:t.join(" ")});continue}if(!i){_();continue}c(),p.push(x(i))}return _(),o.filter(a=>a.paragraphs.length>0||!!a.blocks?.length)}function y(a){return a.normalize("NFKC").toLocaleLowerCase("ko-KR").trim().replace(/\s+/g," ")}f.body.slice(0,5),f.body.slice(5,8),f.body.slice(8),String.raw`\mathcal A_X=\{a,b,c,d,e,f,g,h\},\qquad H_0(X)=\log_2|\mathcal A_X|=3\ \text{bits}`,String.raw`P_X=\left\{\frac14,\frac14,\frac14,\frac3{16},\frac1{64},\frac1{64},\frac1{64},\frac1{64}\right\}`,String.raw`P(X\in\{a,b,c,d\})=\frac{15}{16},\qquad P(X\in\{e,f,g,h\})=\delta=\frac1{16}`,String.raw`\frac1N H_\delta(X^N)\longrightarrow H(X)\qquad(N\to\infty)`,String.raw`\forall\epsilon>0,\ 0<\delta<1,\ \exists N_0:\ N>N_0\Longrightarrow\left|\frac1N H_\delta(X^N)-H(X)\right|<\epsilon`,String.raw`\mathbb E[r]=Np_1,\qquad\operatorname{Var}(r)=Np_1(1-p_1)`,String.raw`\frac{\operatorname{std}(r)}{\mathbb E[r]}=\frac{\sqrt{Np_1(1-p_1)}}{Np_1}=O(N^{-1/2})`,String.raw`p(x^N)=\prod_{k=1}^Np(x_k),\qquad \frac1N\log_2\frac1{p(x^N)}=\frac1N\sum_{k=1}^N\log_2\frac1{p(x_k)}\approx H(X)`,String.raw`T_{N,\beta}=\left\{x^N\in\mathcal A_X^N:\left|\frac1N\log_2\frac1{p(x^N)}-H(X)\right|<\beta\right\}`,String.raw`x^N\in T_{N,\beta}\quad\Longrightarrow\quad 2^{-N(H+\beta)}<p(x^N)<2^{-N(H-\beta)}`,String.raw`T\ge0,\ a>0\qquad\Longrightarrow\qquad P(T\ge a)\le\frac{\mathbb E[T]}a`,String.raw`P(|X-\mathbb E[X]|\ge\epsilon)\le\frac{\operatorname{Var}(X)}{\epsilon^2}`,String.raw`X_N=\frac1N\sum_{i=1}^Nh_i,\qquad\mathbb E[X_N]=h,\qquad\operatorname{Var}(X_N)=\frac{\sigma_h^2}{N}`,String.raw`P(|X_N-h|\ge\epsilon)\le\frac{\sigma_h^2}{N\epsilon^2}\longrightarrow0`,String.raw`h_i=\log_2\frac1{p(X_i)},\qquad\mathbb E[h_i]=H(X)`,String.raw`P\!\left(\left|\frac1N\log_2\frac1{p(X^N)}-H(X)\right|\ge\beta\right)\le\frac{\sigma_h^2}{N\beta^2}`,String.raw`P(X^N\in T_{N,\beta})\ge1-\frac{\sigma_h^2}{N\beta^2}\longrightarrow1`,S(String.raw`# polynomial curve fitting

다음과 같이 모델을 정하고, loss function을 거친다.
$$y(x,\mathbf{w})=(w_0\;w_1\;\cdots\;w_M)\begin{pmatrix}1\\x\\\vdots\\x^M\end{pmatrix}=\mathbf{w}^\top\mathbf{x}$$
$$E(\mathbf{w})=\frac{1}{2}\sum_{n=1}^{N}\left(y(x_n,\mathbf{w})-t_n\right)^2$$

이때, 과적합을 해소하는데 여러 방법이 있다.(Test Error, Training Error)
- $M$을 작게 설정한다.
- 데이터 양을 늘려 해소하기도 한다.
- regularization을 도입(=weight decay)
$$\widetilde{E}(\mathbf{w})=\frac{1}{2}\sum_{n=1}^{N}\{y(x_n,\mathbf{w})-t_n\}^{2}+\frac{\lambda}{2}\|\mathbf{w}\|^{2}$$
$$\|\mathbf{w}\|^{2}=\mathbf{w}^{T}\mathbf{w}=\sum_{i=0}^{M}w_i^{2}$$

# Probability Theory
과적합을 해소하는 더 근본적인 방법으로 접근한다.
확률적 해석을 통해 접근하는 방법으로 다음과 같은
기본 정리를 숙지해야 한다.

marginalization을 통해 다음과 같이 나타낼 수 있다.
$$p(X)=\sum_Y p(X,Y)$$

또한 joint probability & conditional probability를 통해
$$p(X,Y)=p(Y\mid X)p(X)$$ 다음과 같이 전개가 가능하다.

이를 Bayes Rule에 의해
$$p(Y\mid X)=\frac{p(X\mid Y)p(Y)}{p(X)}$$

a에서 b까지 구간에서 x가 있을 확률은 다음과 같으며,
$$p(x\in(a,b))=\int_a^b p(x)\,dx$$

jacobian을 이용해 다음과 같이 표현 가능하다.
$$p(x)\delta x\sim p(y)\delta y\Rightarrow p(y)=p(x)\left|\frac{dx}{dy}\right|=p(x)|J|$$

또한 이를 Delta function을 통해 표현이 가능한데,
$$p(y)=\int p(x)\delta(y-f(x))\,dx$$
으로, $\delta(y-f(x))$가 Delta function에 해당되며, 모든 x에 대해 적분하되, $y=f(x)$인 지점을만 확률에 기여하도록 만든다.

다음은 누적확률분포(CDF)에서 확률밀도함수(PDF)를 얻는 유도과정이다.
$$P[x\le a]=\int_{-\infty}^{a}p(x)\,dx$$
$$P[x\le a]=\int_{-\infty}^{\infty}p(x)\Theta(a-x)\,dx$$
여기서 $\Theta$는 Heaviside step function으로, a가 x보다 크거나 같으면 1, 작으면 0을 반환한다.

각각을 미분하면
$$\frac{\partial}{\partial a}P[x\le a]=p(a)$$

$$\frac{\partial}{\partial a}\int_{-\infty}^{\infty}p(x)\Theta(a-x)\,dx=\int_{-\infty}^{\infty}p(x)\frac{\partial}{\partial a}\Theta(a-x)\,dx$$
(Heaviside step function을 미분하면 Dirac delta function이 된다고 한다.)



또한 확률분포에 대한 성질을 정리한 부분이다.
$$\mathbb{E}[f] = \sum_x p(x)f(x)$$

$$\mathbb{E}[f] = \int p(x)f(x)\,dx$$

$$\mathbb{E}[f] \simeq \frac{1}{N}\sum_{n=1}^{N} f(x_n)$$

$$\mathbb{E}_x[f \mid y] = \sum_x p(x \mid y) f(x)$$


$$\operatorname{var}[f] = \mathbb{E}[(f(x)-\mathbb{E}[f(x)])^2] = \mathbb{E}[f(x)^2] - \mathbb{E}[f(x)]^2$$

$$\operatorname{cov}[x,y] = \mathbb{E}_{x,y}[(x-\langle x\rangle)(y-\langle y\rangle)] = \mathbb{E}_{x,y}[xy] - \mathbb{E}[x]\mathbb{E}[y]$$

다음은 Bayesian에 대한 내용이다.
$$p(w \mid \mathcal{D}) = \frac{p(\mathcal{D}\mid w)p(w)}{p(\mathcal{D})}$$

Maximum likelihood에 대한 내용으로, likelihood가 가장 커지는 인자를 찾는 것이다. 여기서 prior을 이용하지 않으며, 즉 데이터만 보고 파라미터를 고른다.
$$\arg\max_w p(\mathcal{D}\mid w)$$

# Gaussian Distribution
$\text{noise} \rightarrow \text{Gaussian likelihood} \rightarrow \text{MLE} \rightarrow \text{squared error}$

$\text{prior on } w \rightarrow \text{Gaussian prior} \rightarrow \text{MAP} \rightarrow \text{L2 regularization}$

다음과 같은 흐름처럼 가우시안의 가정은 매우 중요하다.

## 1-D / Multivariate Gaussian distribution

$\mathcal{N}(x\mid \mu,\sigma^2)=\frac{1}{\sqrt{2\pi\sigma^2}}\exp\left\{-\frac{1}{2\sigma^2}(x-\mu)^2\right\}$

$\mathcal{N}(x\mid \mu,\Sigma)=\frac{1}{(2\pi)^{D/2}|\Sigma|^{1/2}}\exp\left\{-\frac{1}{2}(x-\mu)^T\Sigma^{-1}(x-\mu)\right\}$

다음은 가우시안 분포의 평균과 분산을 MLE로 추정할 때의 결과에 대한 정리이다.


$p(\mathbf{x}\mid\mu,\sigma^2)=\prod_{n=1}^{N}\mathcal{N}(x_n\mid\mu,\sigma^2)$

$\ln p(\mathbf{x}\mid\mu,\sigma^2)=-\frac{1}{2\sigma^2}\sum_{n=1}^{N}(x_n-\mu)^2-\frac{N}{2}\ln\sigma^2-\frac{N}{2}\ln(2\pi)$

다음은 평균에 대한 정리이다.
$\partial_\mu\ln p=\frac{1}{\sigma^2}\sum_{n=1}^{N}(x_n-\mu)=0$
$\mu_{\mathrm{ML}}=\frac{1}{N}\sum_{n=1}^{N}x_n$

다음은 분산에 대한 정리이다.
$\partial_\sigma\ln p=\frac{1}{\sigma^3}\sum_{n=1}^{N}(x_n-\mu)^2-\frac{N}{\sigma}=0$

$\sigma_{\mathrm{ML}}^2=\frac{1}{N}\sum_{n=1}^{N}(x_n-\mu_{\mathrm{ML}})^2$
$\mathbb{E}[\sigma_{\mathrm{ML}}^2]=\frac{N-1}{N}\sigma^2$
(자유도의 관점에서 이미 평균 추정에 사용되었으므로 자유도를 1 잃었다고 생각하면 된다.)
평균과 분산은 각각 unbiased estimator, biased estimator라고 볼 수 있는데,
MLE 분산은 실제 분산 보다 작게 나온다.

여기서 알 수 있는 점은 MLE는 관측 데이터에 가장 잘 맞는 parameter를 고르지만, finite data에서는 bias나 overfitting 문제가 생길 수 있다.

# MLE

## MLE와 최소제곱오차

MLE는 관측된 데이터가 가장 그럴듯하게 나타나도록 parameter를 추정하는 방법이다. Polynomial curve fitting에서 target 값이 모델 출력값 주변의 Gaussian noise를 포함한다고 가정하면, 각 target은 평균이 모델 예측값인 Gaussian distribution에서 생성된 것으로 볼 수 있다.

전체 데이터에 대한 likelihood는 각 데이터가 독립적으로 생성되었다는 가정 아래 곱으로 표현된다.

$p(\mathbf{t}\mid\mathbf{x},\mathbf{w},\beta)=\prod_{n=1}^{N}p(t_n\mid x_n,\mathbf{w},\beta)$

MLE는 이 likelihood를 최대화하는 $\mathbf{w}$와 $\beta$를 찾는 것이다. 곱 형태는 다루기 어렵기 때문에 log를 취해 log-likelihood로 바꾼다. log는 단조증가 함수이므로 likelihood를 최대화하는 것과 log-likelihood를 최대화하는 것은 동일하다.

Gaussian log-likelihood에서 $\mathbf{w}$에 의존하는 항은 다음과 같다.

$-\frac{\beta}{2}\sum_{n=1}^{N}\{t_n-y(x_n,\mathbf{w})\}^2$

따라서 log-likelihood를 최대화하는 것은 제곱오차를 최소화하는 것과 같다. 즉, Gaussian noise assumption 아래에서 MLE는 sum-of-squares error minimization과 연결된다.

## MLE, MAP와 Regularization

기존 curve fitting에서는 overfitting을 막기 위해 loss에 weight penalty를 추가한다.

$E(\mathbf{w})=\frac{1}{2}\sum_{n=1}^{N}\{y(x_n,\mathbf{w})-t_n\}^2+\frac{\lambda}{2}\mathbf{w}^T\mathbf{w}$

첫 번째 항은 data fitting term이고, 두 번째 항은 regularization term이다. 이 regularization term은 weight가 너무 커지는 것을 막아 모델이 지나치게 복잡해지는 것을 방지한다.

Bayesian 관점에서는 이 regularization term을 prior로 해석할 수 있다. 예를 들어 parameter $\mathbf{w}$에 대해 Gaussian prior를 둔다고 하자.

$p(\mathbf{w})=\mathcal{N}(\mathbf{w}\mid 0,\alpha^{-1}I)$

이는 $\mathbf{w}$가 0 근처에 있을 가능성이 높고, 큰 weight 값은 나올 가능성이 낮다고 가정하는 것이다.

이 prior의 log를 취하면 $\mathbf{w}$에 의존하는 항은 다음과 같다.

$\log p(\mathbf{w})=-\frac{\alpha}{2}\mathbf{w}^T\mathbf{w}+\text{constant}$

MAP estimation은 likelihood와 prior를 결합한 posterior를 최대화하는 방식이다. 따라서 MAP는 다음 objective를 최소화하는 문제와 같아진다.

$\frac{\beta}{2}\sum_{n=1}^{N}\{y(x_n,\mathbf{w})-t_n\}^2+\frac{\alpha}{2}\mathbf{w}^T\mathbf{w}$

전체를 $\beta$로 나누면 기존 regularized error function과 같은 형태가 된다.

$\frac{1}{2}\sum_{n=1}^{N}\{y(x_n,\mathbf{w})-t_n\}^2+\frac{\lambda}{2}\mathbf{w}^T\mathbf{w}$

이때

$\lambda=\frac{\alpha}{\beta}$

이다.

여기서 $\alpha$는 prior의 precision이고, $\beta$는 noise의 precision이다. 따라서 $L_2$ regularization은 Bayesian 관점에서 Gaussian prior를 둔 MAP estimation으로 해석할 수 있다.`,{headingReplacements:{"polynomial curve fitting":"Polynomial Curve Fitting","1-D / Multivariate Gaussian distribution":"1차원·다변량 Gaussian 분포"}}),S(String.raw`# Binary Classification

## Notation
### Inpu


$(x, y)$
여기서 $n_x$은 픽셀의 개수(예: 128x128x3)를 의미하고, $y$는 정답 여부(0,1)를 의미한다.
$\quad x \in \mathbb{R}^{n_x},\ y \in \{0,1\}$
input이 m개만큼 있다면 다음과 같다.
$X \in \mathbb{R}^{n_x \times m}$, $Y \in \mathbb{R}^{1 \times m}$

다음은 주어진 input의 $x$를 가지고, $\hat{y}$를 추정해야 하는데 다음과 같이 표현할 수 있다.
$\hat{y}=\sigma(w^Tx+b),\ \text{where}\ \sigma(z)=\frac{1}{1+e^{-z}}$
파라미터:
- $w$: 가중치
- $b$: bias
활성화함수(비선형성을 부여하거나, 출력값 형태 조절 위함)
- $\sigma()$: 마지막 layer에 출력 값의 구간을 0~1로 맞추기 위함.

## Loss function
$\mathcal{L}(\hat{y},y)=-(y\log\hat{y}+(1-y)\log(1-\hat{y}))$

## Cost function
$J(w,b)=-\frac{1}{m}\sum_{i=1}^{m}(y^{(i)}\log\hat{y}^{(i)}+(1-y^{(i)})\log(1-\hat{y}^{(i)}))$

## Gradient Descen
Cost function에 의해 $J(w,b)$을 구했고, $J(w,b)$를 최소화 하는 것을 목적으로 함.

$w:=w-\alpha\frac{\partial J(w,b)}{\partial w}$

$b:=b-\alpha\frac{\partial J(w,b)}{\partial b}$

기울기의 반대방향으로 이동하기 위해 음수 값을 붙였으며, $\alpha$ = learning rate에 해당함.

m개의 examples이 들어올 때는 다음과 같다.
$J(w,b)=\frac{1}{m}\sum_{i=1}^{m}\mathcal{L}(a^{(i)},y^{(i)})$

$\frac{\partial}{\partial w_1}J(w,b)=\frac{1}{m}\sum_{i=1}^{m}\frac{\partial}{\partial w_1}\mathcal{L}(a^{(i)},y^{(i)})$

# 학습과정
Forward propagation → Loss 계산 → Back propagation → Gradient descent로 가중치 업데이트 순으로 진행한다.

## Forward propagation
### n개의 노드일 때
$z_n^{[1]}=w_n^{[1]T}x+b_n^{[1]}$

$a_n^{[1]}=\sigma(z_n^{[1]})$

여기서 $z_n^{[1]}$의 $[1]$은 layer를 의미한다.

각 노드는 이전 layer의 값들을 가중합한 뒤 활성화 함수를 통과시켜 다음 layer로 보낼 값을 만든다. 가중치와 bias의 초기값은 보통 랜덤으로 설정하고, 학습 과정에서 계속 수정된다.
### layer가 여러 개 일 때,
$Z^{[l]}=W^{[l]}A^{[l-1]}+b^{[l]}$

$A^{[l]}=g^{[l]}(Z^{[l]})$

여기서 주목할 것은 다음 layer의 input $A$값이 이전 layer의 $A^{[1]}$값으로 활용한다는 것이다.
Forward propagation을 통해 모델의 예측값을 구한다.($A^{[l]}$)

또한 z값을 cache로 하여 임시 저장한다(backward propagation에 사용하기 위함)
## Loss 계산
$\mathcal{L}(a,y)=-(y\log(a)+(1-y)\log(1-a))$

$J(w,b)=-\frac{1}{m}\sum_{i=1}^{m}(y^{(i)}\log\hat{y}^{(i)}+(1-y^{(i)})\log(1-\hat{y}^{(i)}))$

## Backward propagation
$dZ^{[2]}=A^{[2]}-Y$

$dW^{[2]}=\frac{1}{m}dZ^{[2]}A^{[1]T}$


$db^{[2]}=\frac{1}{m}\mathrm{np.sum}(dZ^{[2]},\mathrm{axis}=1,\mathrm{keepdims}=\mathrm{True})$

$dZ^{[1]}=(W^{[2]T}dZ^{[2]})\odot g^{[1]'}(Z^{[1]})$

$dW^{[1]}=\frac{1}{m}dZ^{[1]}X^T$

$db^{[1]}=\frac{1}{m}\mathrm{np.sum}(dZ^{[1]},\mathrm{axis}=1,\mathrm{keepdims}=\mathrm{True})$


forward propagation을 통해 얻은 $W,b$를 cache로 저장한 $Z$를 이용해 $dW, db$를
구한다.
chain rule을 이용해 다음과 같이 표현 가능하다.

$\frac{dL}{dW^{[l]}}=\frac{dL}{dA^{[l]}}\frac{dA^{[l]}}{dZ^{[l]}}\frac{dZ^{[l]}}{dW^{[l]}}$

# Example
벡터의 차원을 고려해서 전체 과정을 정리하면 다음과 같다.
example:
- 입력 이미지 $128\times128\times3$, 샘플 수 $m=256$
- 은닉층 64개 → 8개 → 출력층 1개

$128\times128\times3=49152$
$n_x=49152$

## 1. Inpu
$X\in\mathbb{R}^{49152\times256}$(전체 feature 수 x 샘플 수)

$Y\in\mathbb{R}^{1\times256}$(정답/오답 유무 x 샘플 수)
## 2. Forward Propagation

### LAYER 1(64 Nodes)

$W^{[1]}\in\mathbb{R}^{64\times49152}$(노드 수 x 이전 layer(0번째는 input x의 feature)

$b^{[1]}\in\mathbb{R}^{64\times1}$(노드 수 x 각각의 bias)

$Z^{[1]}=(64\times49152)(49152\times256)+(64\times1)$

$Z^{[1]}\in\mathbb{R}^{64\times256}$(노드 수 x 샘플 수)

$A^{[1]}=g^{[1]}(Z^{[1]})$

$A^{[1]}\in\mathbb{R}^{64\times256}$(변함 없음)

### LAYER 2(8 Nodes)
$W^{[2]}\in\mathbb{R}^{8\times64}$(노드 수 x 이전 layer 노드 수)

$b^{[2]}\in\mathbb{R}^{8\times1}$

$Z^{[2]}=W^{[2]}A^{[1]}+b^{[2]}$

$Z^{[2]}=(8\times64)(64\times256)+(8\times1)$

$Z^{[2]}\in\mathbb{R}^{8\times256}$

$A^{[2]}=g^{[2]}(Z^{[2]})$

$A^{[2]}\in\mathbb{R}^{8\times256}$(노드 수 x 샘플 수)

### LAYER 3(1 Node)

$\hat{Y}\in\mathbb{R}^{1\times256}$

## 3. Loss 계산
똑같이 이 과정을 example 개수 만큼 진행한다.
$\mathcal{L}(A^{[3]},Y)=-(Y\log A^{[3]}+(1-Y)\log(1-A^{[3]}))$

$J=\frac{1}{m}\sum_{i=1}^{m}\mathcal{L}(A^{[3](i)},Y^{(i)})$

$m=256$(샘플 수)

## 4. Back Propagation
$dZ^{[3]}=A^{[3]}-Y$
$dZ^{[3]}\in\mathbb{R}^{1\times256}$
$dW^{[3]}=\frac{1}{m}dZ^{[3]}A^{[2]T}$
$dW^{[3]}=(1\times256)(256\times8)$

$dW^{[3]}\in\mathbb{R}^{1\times8}$

$db^{[3]}=\frac{1}{m}\mathrm{np.sum}(dZ^{[3]},\mathrm{axis}=1,\mathrm{keepdims}=\mathrm{True})$

$db^{[3]}\in\mathbb{R}^{1\times1}$


$dA^{[2]}=W^{[3]T}dZ^{[3]}$
$dA^{[2]}=(8\times1)(1\times256)$

$dA^{[2]}\in\mathbb{R}^{8\times256}$


## 5. 가중치 업데이트
$W^{[1]}:=W^{[1]}-\alpha dW^{[1]}$

$b^{[1]}:=b^{[1]}-\alpha db^{[1]}$

$W^{[2]}:=W^{[2]}-\alpha dW^{[2]}$

$b^{[2]}:=b^{[2]}-\alpha db^{[2]}$

$W^{[3]}:=W^{[3]}-\alpha dW^{[3]}$

$b^{[3]}:=b^{[3]}-\alpha db^{[3]}$


| 값                 |               차원 |
| ----------------- | ---------------: |
| $X$               | $49152\times256$ |
| $Y$               |     $1\times256$ |
| $W^{[1]}$         |  $64\times49152$ |
| $b^{[1]}$         |      $64\times1$ |
| $Z^{[1]},A^{[1]}$ |    $64\times256$ |
| $W^{[2]}$         |      $8\times64$ |
| $b^{[2]}$         |       $8\times1$ |
| $Z^{[2]},A^{[2]}$ |     $8\times256$ |
| $W^{[3]}$         |       $1\times8$ |
| $b^{[3]}$         |       $1\times1$ |
| $Z^{[3]},A^{[3]}$ |     $1\times256$ |
| $dZ^{[3]}$        |     $1\times256$ |
| $dW^{[3]}$        |       $1\times8$ |
| $db^{[3]}$        |       $1\times1$ |
| $dZ^{[2]}$        |     $8\times256$ |
| $dW^{[2]}$        |      $8\times64$ |
| $db^{[2]}$        |       $8\times1$ |
| $dZ^{[1]}$        |    $64\times256$ |
| $dW^{[1]}$        |  $64\times49152$ |
| $db^{[1]}$        |      $64\times1$ |`,{headingReplacements:{"layer가 여러 개 일 때,":"여러 레이어일 때","LAYER 1(64 Nodes)":"Layer 1(64 Nodes)","LAYER 2(8 Nodes)":"Layer 2(8 Nodes)","LAYER 3(1 Node)":"Layer 3(1 Node)"}}),S(String.raw`## Train/dev/test sets
1) 데이터가 적은 경우
- 70/30% 또는 60/20/20%

2) 데이터가 많은 경우
- 98/1/1% 또는 99.5/0.4/0.1%

훈련 세트는 파라미터를 학습하는 데 사용하고, dev 세트는 하이퍼파라미터와 모델 선택에 사용한다. test 세트는 최종 일반화 성능을 확인할 때만 사용한다.

## Bias / Variance
- bias: 모델이 정답에서 평균적으로 얼마나 빗나가는가
- variance: 데이터가 조금 바뀔 때 모델 예측이 얼마나 흔들리는가
- underfitting: 모델이 너무 단순해 훈련 데이터에서도 충분한 성능을 내지 못하는 상태
- overfitting: 훈련 데이터에는 잘 맞지만 새로운 데이터에서는 성능이 낮아지는 상태

Underfitting은 높은 bias, overfitting은 높은 variance와 연결된다. 모델이 유연할수록 variance가 커질 수 있고, 지나치게 단순할수록 bias가 커질 수 있다. 따라서 두 값 사이의 trade-off를 고려해야 한다.

## 해소 방법
### Regularization
#### L1 regularization과 L2 regularization
가중치 $w$를 작게 만드는 방식이며, 규제 형태에 따라 희소성(sparsity)이 달라진다.
- Ridge(L2): 제곱값을 벌점으로 사용하며 가중치를 정확히 0으로 만들지는 않는다.
- Lasso(L1): 절댓값을 벌점으로 사용하며 중요하지 않은 feature의 가중치를 0으로 만들 수 있다.

$J(w,b)=\frac{1}{m}\sum_{i=1}^{m}\mathcal{L}(\hat{y}^{(i)},y^{(i)})+\frac{\lambda}{2m}\lVert w\rVert_2^2$
$\lVert w\rVert_2^2=\sum_{j=1}^{n_x}w_j^2=w^Tw$
$\lVert w\rVert_1=\sum_{j=1}^{n_x}|w_j|$

#### Dropou
- 학습 중 각 layer의 일부 노드를 무작위로 제외해 특정 경로에 과도하게 의존하는 것을 줄인다.

#### Data Augmentation
- 기존 학습 데이터를 변형해 데이터의 다양성과 양을 늘린다.

#### Early Stopping
- validation loss가 더 이상 개선되지 않으면 학습을 중단한다.

#### Normalizing Training Sets
- 입력 feature의 scale을 맞춰 최적화가 안정적으로 진행되도록 한다.

## Batch
Gradient Descent에서 한 번의 파라미터 업데이트에 사용할 데이터 수를 정한다.

1) Batch Gradient Descen
- 한 번 업데이트할 때 전체 학습 데이터를 사용한다.
- gradient는 안정적이지만 데이터가 많으면 iteration당 계산 시간이 길다.

2) Mini-batch Gradient Descen
- Batch Gradient Descent보다 업데이트가 자주 일어난다.
- SGD보다 gradient가 안정적이다.
- 행렬 연산과 vectorization의 장점을 활용할 수 있다.

3) Stochastic Gradient Descent(SGD)
- 샘플 하나로 업데이트하므로 gradient의 변동이 크다.
- 한 epoch에 샘플 수만큼 업데이트한다.

CPU·GPU 메모리와 데이터 크기에 따라 64, 128, 256, 512, 1024 등의 batch size를 선택한다. 훈련 세트가 대략 2,000개 이하로 작다면 full-batch도 고려할 수 있다.

## Exponentially Weighted Average
$v_t=\beta v_{t-1}+(1-\beta)\theta_t$
$\beta=0.9\quad\Rightarrow\quad\text{effective window}\approx\frac{1}{1-\beta}=10$

## Bias Correction
초기값을 0으로 두면 이동평균이 초반에 실제 평균보다 작게 계산된다. 이를 보정하기 위해 $v_t$를 $1-\beta^t$로 나눈다.

$v_t=\beta v_{t-1}+(1-\beta)\theta_t$
$\widehat{v}_t=\frac{v_t}{1-\beta^t}$
$\beta=0.98,\ t=2:\quad1-\beta^t=1-(0.98)^2\approx0.0396$

## RMSprop
gradient 제곱의 이동평균을 이용해 파라미터별 learning rate를 조절한다.
$s_{dW}:=\beta s_{dW}+(1-\beta)dW^2$
$s_{db}:=\beta s_{db}+(1-\beta)db^2$
$W:=W-\alpha\frac{dW}{\sqrt{s_{dW}}+\epsilon}$
$b:=b-\alpha\frac{db}{\sqrt{s_{db}}+\epsilon}$

## Adam Optimization
Momentum, RMSprop, Bias Correction을 결합한 optimizer다.
$v_{dW}=0,\ v_{db}=0,\ s_{dW}=0,\ s_{db}=0$
$v_{dW}:=\beta_1v_{dW}+(1-\beta_1)dW$
$v_{db}:=\beta_1v_{db}+(1-\beta_1)db$
$s_{dW}:=\beta_2s_{dW}+(1-\beta_2)dW^2$
$s_{db}:=\beta_2s_{db}+(1-\beta_2)db^2$
$v_{dW}^{\mathrm{corr}}=\frac{v_{dW}}{1-\beta_1^t}$
$v_{db}^{\mathrm{corr}}=\frac{v_{db}}{1-\beta_1^t}$
$s_{dW}^{\mathrm{corr}}=\frac{s_{dW}}{1-\beta_2^t}$
$s_{db}^{\mathrm{corr}}=\frac{s_{db}}{1-\beta_2^t}$
$W:=W-\alpha\frac{v_{dW}^{\mathrm{corr}}}{\sqrt{s_{dW}^{\mathrm{corr}}}+\epsilon}$
$b:=b-\alpha\frac{v_{db}^{\mathrm{corr}}}{\sqrt{s_{db}^{\mathrm{corr}}}+\epsilon}$

## Learning Rate Decay
학습이 진행될수록 learning rate를 줄여 초반에는 빠르게 이동하고 후반에는 최적점 주변을 세밀하게 탐색한다.

## Batch Normalization
각 layer의 입력값 또는 중간값을 정규화해 학습을 안정적으로 만든다.
$x\rightarrow Z^{[1]}\rightarrow\operatorname{BatchNorm}\rightarrow\widetilde{Z}^{[1]}\rightarrow a^{[1]}$

입력 $x$만 정규화하는 것이 아니라 layer마다 새로 계산되는 $Z$를 mini-batch 기준으로 정규화한다.`,{headingReplacements:{}}),S(String.raw`다음은 K-means Clustering의 수식적인 설명과 Maximum Likelihood의 관계(가우시안 포함)를 MLE의 한계를 다룬다.

# K-means Clustering
K-means Clustering은 비지도 학습의 일종으로,

1) Assignmen
2) Update
3) Assignmen
4) Update
방식으로 군집을 형성하는 방법이다.

좀 더 수식으로 표현할 경우 다음과 같다.

1) 초기 값$m^{(k)}$ 설정
2) $\hat{k}^{(n)}=\arg\min_k\{d(m^{(k)},x^{(n)})\}$: 각 관측값이 어느 군집에 속하는지 정한다.
3) $r_k^{(n)}=\begin{cases}1,&\text{if }\hat{k}^{(n)}=k\\0,&\text{if }\hat{k}^{(n)}\neq k\end{cases}$: 이는 $r_k^{(n)}$는 $n$번째 데이터가 $k$번째 cluster에 속하면 1, 아니면 0이다.
4) $m^{(k)}=\frac{1}{N_k}\sum_{\hat{k}^{(v)}=k}x^{(v)}$: 다시 업데이트를 진행한다. cluster center는 그 cluster에 속한 데이터들의 평균 위치로 이동한다.

해당 방식을 반복해 cluster center가 거의 움직이지 않거나, 배정이 안바뀔 때까지 반복한다.

## K-means의 한계
해당 알고리즘을 확인하면 몇 가지 의문점이 생긴다.
- 중심점을 처음에 어떻게 고를 것인가?
- 거리는 어떤 방식으로 계산할 것인가?
- cluster 개수 $K$는 어떻게 정할 것인가?
- 왜 평균으로 중심을 업데이트하는가?
- 정말 이 방식이 좋은 결과로 가는가?

즉, ad-hoc 요소인 선택들이 알고리즘에 포함되어 있음을 알 수 있다.

후에 이는 K-means는 EM의 특수한 형태, 또는 hard EM처럼 이해할 수 있다.

한계는 다음과 같다고 할 수 있다.
- cluster의 모양을 잘 반영하지 못한다는 것이다.
- 각 sample을 하나의 cluster에만 배정한다는 것이다.

## Soft K-means
$r_k^{(n)}=\frac{\exp\left(-\beta d(m^{(k)},x^{(n)})\right)}{\sum_{k'}\exp\left(-\beta d(m^{(k')},x^{(n)})\right)}$

- 기존 hard K-means와 달리 입력할 데이터가 속할 cluster가 0~1의 확률로 나타난다.

- 거리($d$)가 클 수록 값은 작아지는 관계( = center cluster와의 거리)
- $\beta$: 민감도, cluster간의 responsibility 차이 조절 파라미터(클수록 hard)

Soft K-Means는 각 cluster가 중심을 기준으로 데이터를 Gaussian-like likelihood로 설명한다고 해석할 수 있다.

## 1-D Gaussian, MLE
$\theta^*=\arg\max_\theta \log p(\mathrm{data}\mid\theta,H)$

$\theta=(\mu,\sigma)$

$\ln p({x_n}\mid\mu,\sigma)=-N\log(\sqrt{2\pi}\sigma)-\frac{1}{2\sigma^2}\left(S+N(\bar{x}-\mu)^2\right)$
- 이때 우리가 고려할 부분은 $\mu$ 부분이고, 데이터 평균과 같아지면 0, 멀어질수록, log-likelihood가 감소하게 된다.

이를 $\mu$에 대해 미분할 경우 다음과 같다.
$\partial_\mu\log p({x_n}\mid\mu,\sigma)=-\frac{N}{\sigma^2}(\mu-\bar{x})$
즉, 하나의 Gaussian 분포에서 likelihood를 가장 크게 만드는 평균은 데이터의 산술 평균과 같다.
한번더 미분하면 다음과 같은데,
$\partial_\mu^2\log p=-\frac{N}{\sigma^2}$
이는 함수가 concave하다고 할 수 있다.

$\sigma_\mu\sim\frac{\sigma}{\sqrt{N}}$
이는 데이터의 크기에 따라 평균 추정을 잘 할 수 있음을 의미한다.

## Exponential Family
$p(x\mid\eta)=h(x)g(\eta)\exp(\eta^Tu(x))$
Gaussian 분포를 다음과 같이 변형할 것이다.
- 가우시안 분포의 평균과 분포를 쉽게 계산할 수 있기 때문인데, 이전의 cluster 자체가 가우시안 분포를 가정하기 때문에, 모델 자체를 결정하는 파라미터를 구하는 거라고 볼 수 있다.
- 또한 기존 가우시안 분포 식에서, 지수족(exponential Family)에 해당하는 부분으로 분류함에 따라 필요한 정보가 쉽게 보인다.

가우시안 분포에서 제곱항을 전개한 후, $x, x^2$에 곱해지는 항을 sufficient statistic으로, natural parameter은 다음과 같이 설정한다.

$\eta=(\eta_1,\eta_2)=\left(\frac{\mu}{\sigma^2},-\frac{1}{2\sigma^2}\right)$
$u(x)=(x,x^2)$
$h(x)=\frac{1}{\sqrt{2\pi}}$
$\langle u(x)\rangle=-\nabla\log g(\eta)$
$\langle x^2\rangle-\langle x\rangle^2=\sigma^2$

즉, exponential family 형태로 쓰면 Gaussian 분포는 평균과 분산 같은 quantity가 정규화 함수의 미분으로 나온다.

## GMM(Gaussian Mixture Model)
Gaussian 여러 개로 데이터를 설명하는 것(2개인 경우는 다음과 같다.)

$p(x\mid \mu_1,\mu_2,\sigma)=\sum_{k=1}^{2}p_k\frac{1}{\sqrt{2\pi}\sigma}\exp\left(-\frac{(x-\mu_k)^2}{2\sigma^2}\right)$
$p(x\mid \mu_1,\mu_2,\sigma)=\sum_{k=1}^{2}p_k\mathcal{N}(x\mid\mu_k,\sigma)$

$p_k$ = 각 분포의 mixture weight(사전확률)


$p(k_n=1\mid x_n,\theta)\propto p(x_n\mid\theta,k_n=1)p(k_n=1)$

Bayes Rule을 이용해 다음과 같이 표현할 수 있다.
$p(k_n=1\mid x_n,\theta)=\frac{p_1\mathcal{N}(x_n\mid\mu_1,\sigma)}{p_1\mathcal{N}(x_n\mid\mu_1,\sigma)+p_2\mathcal{N}(x_n\mid\mu_2,\sigma)}$

해당 구조는 기존의 soft k-means와 비슷한 것을 알 수 있다.

또한 두 개의 분포가 확률이 같다면, posterior은 다음과 같이 나타낼 수 있다.
$p(k_n=1\mid x_n,\theta)=\frac{1}{1+\exp\left[\frac{\mu_2-\mu_1}{\sigma^2}x_n+\frac{\mu_1^2-\mu_2^2}{2\sigma^2}\right]}$

$p(k_n=2\mid x_n,\theta)=\frac{1}{1+\exp\left[-\frac{\mu_2-\mu_1}{\sigma^2}x_n-\frac{\mu_1^2-\mu_2^2}{2\sigma^2}\right]}$

이를 $w_1, w_0$를 통해 나타내면 다음과 같고,
$w_1=\frac{\mu_2-\mu_1}{\sigma^2}$

$w_0=\frac{\mu_1^2-\mu_2^2}{2\sigma^2}$

이는 logistic regression / sigmoid 형태로 나타날 수 있다.
$p(k_n=1\mid x_n,\theta)=\frac{1}{1+\exp(w_1x_n+w_0)}$

$p(k_n=2\mid x_n,\theta)=\frac{1}{1+\exp(-w_1x_n-w_0)}$

Gaussian mixture에서 posterior를 계산하면 자연스럽게 logistic 형태가 나온다.

posterior을 구하기 위해서는 $μ_k, p_k$을 알아야 하는데, 실제 문제에서는 모르기 때문에 다른 접근법이 필요하다.

## estimate $\mu_k$

1) $\partial_{\mu_k}\log p(\{x_n\}\mid\{\mu_k\},\sigma)=\sum_n p_{k\mid n}\frac{x_n-\mu_k}{\sigma^2}$
- 각 데이터 $x_n$이 $μ_k$를 움직이는 기여도를 모두 합한 값이다.

2) $\partial_{\mu_k}^2\log p(\{x_n\}\mid\{\mu_k\},\sigma)\approx-\sum_n p_{k\mid n}\frac{1}{\sigma^2}$
- 오목한 모양(최대점이 존재)
- log-likelihood가 $μ_k$ 주변에서 얼마나 휘어져 있는지

3) Newton-Raphson update를 통해 log-likelihood를 최대화하는 $μ_k$를 찾는다.
$\mu_k^{new}=\mu_k-\frac{L'}{L''}$

$\mu_k^{new}=\frac{\sum_np_{k\mid n}x_n}{\sum_np_{k\mid n}}$

$r_k^{(n)}=p_{k\mid n}$

Soft K-Means의 responsibility는 GMM의 posterior처럼 해석할 수 있다.

## MLE의 한계
지금까지 진행한 접근법의 공통점은 데이터에 가장 잘 적합하는 모델 파라미터(평균, 분산 등)을 조절하며, 복잡한 모델일수록 잘 맞출 수 있다.

하지만 이는 overfitting을 일으킨다.

$\mathcal{L}_K=\sum_n\left(x^{(n)}-m_k\right)^2$
$N=K,\quad m_k=x^{(k)}$
$\mathcal{L}_K\to 0$

MLE는 목적 달성(LOSS 감소)을 위해 복잡한 모델을 선호할 수 있으며, 이는 일반화 한계가 존재한다.
(MLE: cluster를 늘려 Loss를 줄이려고 하지만, 이는 noise까지 학습한 overfitting 상태가 됨)`,{headingReplacements:{"estimate $\\mu_k$":"μₖ 추정"}}),S(String.raw`다음은 1-D Gaussian 분포에 대한 MLE와 Bayesian 접근법의 차이에 대한 내용이다.

## MLE-$\mu$
Gaussian의 log-likelihood는 다음과 같다.
$\ln p(\mathbf{x}\mid\mu,\sigma)=-N\log(\sqrt{2\pi}\sigma)-\sum_{n=1}^{N}\frac{(x_n-\mu)^2}{2\sigma^2}$

즉, log-likelihood를 증가시키기 위해서는 두 번째 항의 데이터와 $\mu$의 제곱오차를 최소화해야 한다.

또한 $S$는 데이터가 평균과 얼마나 퍼져 있는지에 대한 정의이고,
$S=\sum_{n=1}^{N}(x_n-\bar{x})^2$

다음과 같이 표현이 가능하다.
$\sum_{n=1}^{N}(x_n-\mu)^2=N(\mu-\bar{x})^2+S$

$\mu$에 대해 미분을 하면 다음과 같다.
$\partial_\mu\ln p=-\frac{N}{\sigma^2}(\mu-\bar{x})$
최대값이 되려면 기울기가 0이 되는 지점으로 다음과 같다.
$\mu^*=\bar{x}$


## MLE-$\sigma$

$\sigma$에 대해 미분을 진행하면 다음과 같다.
$\partial_\sigma\ln p=-\frac{N}{\sigma}+\frac{1}{\sigma^3}\left[N(\mu-\bar{x})^2+S\right]=0$
이는 2개의 항으로 볼 수 있는데, $\sigma$가 너무 크지도, 작지도 않은 적당한 값을 찾아야 한다.

그런데 이전에서 $\mu^*=\bar{x}$임을 알아냈기 때문에, $S$에 대해서만 고려하면 된다.
$\sigma_{\mathrm{MLE}}^2=\frac{1}{N}\sum_{n=1}^{N}(x_n-\bar{x})^2=\frac{S}{N}$

이를 ln$\sigma$ 기준으로 미분을 진행하는 경우에도 결과는 같다.

$\frac{S_{\mathrm{tot}}}{N}\equiv\frac{1}{N}\sum_{n}(x_n-\mu)^2$
$\partial_\sigma\ln p=\partial_\sigma\left(-N\log\sigma-\frac{1}{2\sigma^2}S_{\mathrm{tot}}\right)=-\frac{N}{\sigma}+\frac{S_{\mathrm{tot}}}{\sigma^3}$
$\sigma_{\mathrm{tot}}^2=\frac{1}{N}S_{\mathrm{tot}}$

여기서 미분을 한번 더 해서 sharpness 여부를 확인하는데,
$\sigma^n=\exp(n\ln\sigma)$

$\frac{\partial}{\partial\ln\sigma}\sigma^n=n\sigma^n$
$\frac{\partial}{\partial\ln\sigma}\ln p=-N+\frac{S_{\mathrm{tot}}}{\sigma^2}$
$\frac{\partial^2}{\partial(\ln\sigma)^2}\ln p=-2\frac{S_{\mathrm{tot}}}{\sigma^2}$
$\frac{\partial^2}{\partial(\ln\sigma)^2}\ln p=-2N$
$\sigma_{\ln\sigma}\sim\frac{1}{\sqrt{2N}}$

즉 데이터 $N$이 커질수록 곡률이 커져 최적점이 뾰족해지기 때문에 더 정확한 $\sigma$ 추정이 가능하다.

## Bayesian - prior
기존 MLE의 관점과는 다르게, $\mu$를 하나의 점이 아닌 불확실성을 담은 확률분포로 간주한다.

$\mu$에 대한 prior은 다음과 같다.
$p(\mu\mid\mu_0,\sigma_\mu^2)=\frac{1}{\sqrt{2\pi}\sigma_\mu}\exp\left(-\frac{(\mu-\mu_0)^2}{2\sigma_\mu^2}\right)$

이때, non-informative prior을 위해 다음과 같이 설정한다.
$\mu_0\to0,\quad \sigma_\mu\to\infty$

$p(\mu\mid0,\infty)\approx\frac{1}{\sigma_\mu}$

이때, prior 부분은 상수가 되는데, 확률분포의 전체 적분이 1이 아닌 무한대가 되는 결과가 나오며 이를 improper prior이라고 한다.
$\int p(\mu\mid0,\infty)d\mu\to\infty$


$\beta$(precision)으로 치환한 후, conjugate prior인 Gamma distribution으로 둔 다음,
$\beta\equiv\frac{1}{\sigma^2}$
$p(\beta)=\Gamma(\beta;b,c)=\frac{1}{\Gamma(c)}\frac{\beta^{c-1}}{b^c}\exp\left(-\frac{\beta}{b}\right)$

해당식을 극한으로 보낼 경우 다음을 만족한다.
$p(\beta)\propto\frac{1}{\beta}$

$p(\sigma)=p(\beta)\left|\frac{\partial\beta}{\partial\sigma}\right|\propto\frac{1}{\sigma}$

다시 ln$\sigma$로 바꾸면 다음을 만족한다.
$p(\ln\sigma)=p(\sigma)\frac{\partial\sigma}{\partial\ln\sigma}=1$

즉, 이는 ln$\sigma$에 대해 scale-free prior이다.

## Bayesian - posterior
Bayesian Rule에 따라 다음을 만족한다.
$p(\mu,\sigma\mid{x_n})\propto p({x_n}\mid\mu,\sigma)p(\mu,\sigma)$
(posterior = likelihood * prior)

여기서는 $\mu$에 대한 improper uniform prior $p(\mu)\propto1$과 $\sigma$에 대한 scale-free prior $p(\sigma)\propto1/\sigma$를 구분한다.
먼저 $\sigma$를 고정하고 $\mu$의 posterior를 계산한다.
$p(\mu)\propto1$은 상수이므로 이 조건부 posterior의 모양은 likelihood가 결정한다.
$p(\mu\mid\mathbf{x},\sigma)\propto\exp\left[-\frac{N(\mu-\bar{x})^2}{2\sigma^2}\right]$
여기서 봤을 때, 최적의 posterior은 이전 MLE 접근 방식처럼 $\mu$ 가 $\bar{x}$에 근접해야하는 것 처럼 보이지만,
$p(\mu\mid\mathbf{x},\sigma)\sim\mathcal{N}\left(\bar{x},\frac{\sigma^2}{N}\right)$
해당 식처럼, 데이터 개수가 많아질수록 표준편차가 줄어들어 불확실성이 줄어듬을 알 수 있다.

또한 MLE와는 다르게, $\mu$의 불확실성을 고려하기 위해 marginalization을 진행한다.
이 단계에서는 $p(\mu)\propto1$을 사용해 $\mu$만 적분하며, $p(\sigma)\propto1/\sigma$는 아직 곱하지 않는다.
$p(\mathbf{x}\mid\sigma)=\int d\mu\,p(\mathbf{x}\mid\mu,\sigma)p(\mu)$
이 식은 $\sigma$가 주어졌을 때, 가능한 모든 $\mu$를 고려하여 데이터 $\mathbf{x}$가 나올 확률을 계산한다는 의미이다.

이전에 설명했던 것 처럼 Gaussian likelihood은 두 항으로 나눌 수 있다.
$\sum_n(x_n-\mu)^2=N(\bar{x}-\mu)^2+S$

$\mu$를 적분하면 다음과 같은 형태가 나온다.
$p(\mathbf{x}\mid\sigma)\propto\frac{1}{\sigma_\mu}\exp\left(-\frac{S}{2\sigma^2}\right)\sqrt{\frac{2\pi\sigma^2}{N}}\left(\frac{1}{\sqrt{2\pi}\sigma}\right)^N$
여기서 중요한 부분은 $\sqrt{2\pi\sigma^2/N}$이다.
이 항은 $\mu$를 하나의 값으로 찍지 않고, 가능한 $\mu$들을 적분했기 때문에 생긴다.

1 / σ_μ
→ μ에 대한 prior에서 나온 항

exp(-S / 2σ²)
→ 데이터의 퍼짐 S를 σ가 얼마나 잘 설명하는지 나타내는 항

sqrt(2πσ² / N)
→ μ를 적분하면서 생긴 Gaussian integral 항

(1 / sqrt(2π)σ)^N
→ N개의 Gaussian likelihood 정규화 항



로그를 취하면 다음과 같고, 3번째 항을 주목해야한다.
$\ln p(\mathbf{x}\mid\sigma)=-N\log(\sqrt{2\pi}\sigma)-\frac{S}{2\sigma^2}+\log\left(\sqrt{\frac{2\pi}{N}}\frac{\sigma}{\sigma_\mu}\right)$

이를 occam factor라고 하는데, Occam factor는 가장 잘 맞는 parameter 하나만 보는 것이 아니라, 그 주변의 가능한 parameter 영역까지 고려하는 효과를 준다.
$\frac{\partial}{\partial\ln\sigma}\log p(\mathbf{x}\mid\sigma)=-N+\frac{S}{\sigma^2}+1$
이 미분은 $p(\sigma)$를 곱한 posterior가 아니라, $\mu$를 적분한 marginal likelihood $p(\mathbf{x}\mid\sigma)$를 최대화한다.



MLE에서는 평균 $\mu$를 데이터 평균 $\bar{x}$로 고정한 뒤 분산을 계산한다.

$\sigma_{\mathrm{MLE}}^2=\frac{S}{N}$

하지만 문제는 $\bar{x}$도 데이터로부터 추정한 값이라는 점이다.
즉, 데이터 $N$개 중 하나의 자유도는 평균을 추정하는 데 사용되었다.

따라서 분산을 추정할 때 실제로 남은 자유도는 $N$개가 아니라 $N-1$개이다.

$\mu$를 적분한 marginal likelihood는 $\mu$를 한 점으로 고정하지 않기 때문에 이 자유도 손실을 반영한다.

그 최대점은 다음과 같다.

$\sigma_{\mathrm{marginal}}^2=\frac{S}{N-1}$

이 값은 $p(\sigma)\propto1/\sigma$까지 곱한 posterior의 mode가 아니라, $p(\mu)\propto1$로 $\mu$만 적분한 marginal likelihood의 최대점이다. 결과가 자유도 보정 표본분산과 일치하지만, 모든 Bayesian 분산 추정이 항상 $S/(N-1)$이라는 뜻은 아니다.
그 결과 MLE가 가지는 문제점을 완화하는 효과를 준다.`,{headingReplacements:{"MLE-$\\mu$":"MLE - 평균 μ","MLE-$\\sigma$":"MLE - 표준편차 σ"}}),[...b];let k=["ISLR","정보이론","OpenRouteService","Python"];a.s(["ArchiveSearchPage",0,function({documents:a}){let[i,s]=(0,r.useState)(""),m=(0,r.useDeferredValue)(i),g=(0,r.useRef)(null),l=(0,r.useMemo)(()=>(function(a,t){let e=y(t);if(!e)return a;let r=e.split(" ");return a.flatMap(a=>{if(!r.every(t=>a.searchableText.includes(t)))return[];let t=y(a.title),i=y(a.tags.join(" ")),n=0;return t===e&&(n+=20),t.startsWith(e)&&(n+=10),t.includes(e)&&(n+=6),i.includes(e)&&(n+=4),[{document:a,score:n}]}).toSorted((a,t)=>t.score-a.score||t.document.updatedAt.localeCompare(a.document.updatedAt)).map(({document:a})=>a)})(a,m),[m,a]);return(0,r.useEffect)(()=>{let a=new URLSearchParams(window.location.search).get("q"),t=window.setTimeout(()=>{a&&s(a)},0),e=a=>{let t=a.target,e=t?.matches("input, textarea, select, [contenteditable='true']");"/"!==a.key||e||(a.preventDefault(),g.current?.focus()),"Escape"===a.key&&document.activeElement===g.current&&(s(""),g.current?.blur())};return window.addEventListener("keydown",e),()=>{window.clearTimeout(t),window.removeEventListener("keydown",e)}},[]),(0,r.useEffect)(()=>{let a=new URL(window.location.href);i.trim()?a.searchParams.set("q",i.trim()):a.searchParams.delete("q"),window.history.replaceState({},"",`${a.pathname}${a.search}${a.hash}`)},[i]),(0,t.jsxs)("div",{className:"archive-search-explorer",children:[(0,t.jsxs)("form",{className:"archive-search-form",role:"search",onSubmit:a=>a.preventDefault(),children:[(0,t.jsx)(o,{"aria-hidden":"true"}),(0,t.jsx)("label",{className:"archive-sr-only",htmlFor:"archive-search-input",children:"전체 기록 검색"}),(0,t.jsx)("input",{id:"archive-search-input",onChange:a=>s(a.target.value),placeholder:"제목 · 분야 · 키워드 · 도구",ref:g,type:"search",value:i}),i?(0,t.jsx)("button",{"aria-label":"검색어 지우기",onClick:()=>s(""),type:"button",children:(0,t.jsx)(p.X,{"aria-hidden":"true"})}):(0,t.jsx)("kbd",{"aria-hidden":"true",children:"/"})]}),(0,t.jsxs)("div",{className:"archive-search-suggestions","aria-label":"추천 검색어",children:[(0,t.jsx)("span",{children:"추천"}),k.map(a=>(0,t.jsx)("button",{onClick:()=>s(a),type:"button",children:a},a))]}),(0,t.jsxs)("div",{className:"archive-search-status","aria-live":"polite","aria-atomic":"true",children:[(0,t.jsxs)("strong",{children:["기록(",l.length,")"]}),(0,t.jsx)("span",{children:m?`“${m}”`:"전체"})]}),l.length?(0,t.jsx)("ol",{className:"archive-search-results","aria-label":"검색 결과",children:l.map(a=>(0,t.jsx)("li",{children:(0,t.jsxs)(e.default,{href:`/notes/${a.slug}`,children:[(0,t.jsxs)("span",{className:"archive-search-result-meta",children:[(0,t.jsx)("i",{children:a.category}),(0,t.jsx)("time",{dateTime:a.updatedAt,children:function(a){let[t,e,r]=a.split("-");return`${t}.${e}.${r}`}(a.updatedAt)})]}),(0,t.jsx)("strong",{children:a.title}),(0,t.jsx)("span",{className:"archive-search-result-summary",children:a.summary}),a.tags.length?(0,t.jsx)("span",{className:"archive-search-result-tags","aria-label":"키워드와 도구",children:a.tags.slice(0,4).map(a=>(0,t.jsx)("i",{children:a},a))}):null,(0,t.jsx)(n,{"aria-hidden":"true"})]})},a.slug))}):(0,t.jsxs)("div",{className:"archive-search-empty",role:"status",children:[(0,t.jsx)("strong",{children:"검색 결과 없음"}),(0,t.jsx)("button",{onClick:()=>s(""),type:"button",children:"초기화"})]})]})}],92177)}]);