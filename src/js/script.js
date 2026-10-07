import scissorsIcon from '../assets/images/icon-scissors.svg';
import paperIcon from '../assets/images/icon-paper.svg';
import rockIcon from '../assets/images/icon-rock.svg';
import lizardIcon from '../assets/images/icon-lizard.svg';
import spockIcon from '../assets/images/icon-spock.svg';
const CONFIG = {
  view_transition_duration_ms: 1000,
  house_pick_delay_ms: 3000,
  play_again_delay_ms: 300,
  total_choices_count: 5,
};

const icons = {
  scissors: scissorsIcon,
  paper: paperIcon,
  rock: rockIcon,
  lizard: lizardIcon,
  spock: spockIcon,
};

const elements = {
  themeToggle: document.getElementById('theme-toggle'),
  themeType: document.getElementById('theme-type'),
  pickerTemplate: document.getElementById('picker-template'),
  resultTemplate: document.getElementById('result-template'),
  app: document.getElementById('main'),
};

const state = {
  theme: ['', ''],
  playerPickType: '',
  housePick: '',
  statePlay: '',
  score: 0,
  winnerEl: undefined,
};

const gameRules = {
  rock: ['lizard', 'scissors'],
  paper: ['rock', 'spock'],
  scissors: ['paper', 'lizard'],
  lizard: ['spock', 'paper'],
  spock: ['scissors', 'rock'],
};

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const allStates = ['scissors', 'paper', 'rock', 'lizard', 'spock'];

const removeCurrentView = async callback => {
  const currentView = elements.app.querySelector('.template-view');
  if (!currentView) {
    if (callback) callback();
    return;
  }
  currentView.classList.add('template-close');
  await wait(CONFIG.view_transition_duration_ms);
  currentView.remove();
  callback();
};

const appendNewTemplate = template => {
  const clone = template.content.cloneNode(true);
  elements.app.appendChild(clone);
};

const showTemplate = async template => {
  await removeCurrentView(appendNewTemplate.bind(null, template));
};

const pickTemplate = type => {
  return `
  <div class="token token-${type} size-28 shrink-0 rounded-full min-[375px]:size-32 md:size-48 lg:size-[18.3rem] starting:scale-0 starting:opacity-0 opacity-100 scale-100 duration-300">
    <span class="token-face">
      <img src="${icons[type]}" alt="Scissors" class="token-icon" />
    </span>
  </div>
    `;
};

const handleShowSelctedPicked = type => {
  const HTML = pickTemplate(type);
  const resultTemplate = document.getElementById('result');
  if (!resultTemplate) return;
  const playerPick = resultTemplate.querySelector('#player-pick');
  playerPick.innerHTML = HTML;
};

const updateScore = () => state.score++;

const checkWinner = () => {
  const randomNum = Math.floor(Math.random() * CONFIG.total_choices_count);
  state.housePick = allStates[randomNum];
  if (gameRules[state.playerPickType].includes(state.housePick)) {
    updateScore();
    state.statePlay = 'Won';
    state.winnerEl = document.getElementById('player-pick');
  } else if (state.playerPickType === state.housePick) state.statePlay = 'drew';
  else {
    state.statePlay = 'lost';
    state.winnerEl = document.getElementById('house-pick');
  }
};

const howWinner = async () => {
  checkWinner();
  await updateResultDom();
};

const updateResultDom = async () => {
  await wait(CONFIG.house_pick_delay_ms);
  const pickHouseEl = document.getElementById('house-pick');
  const scoreEl = document.getElementById('score');
  const HTML = pickTemplate(state.housePick);
  pickHouseEl.innerHTML = HTML;
  await wait(CONFIG.play_again_delay_ms);
  const containerReset = document.getElementById('containerReset');
  const outcomeText = document.getElementById('outcome-text');
  if (state.winnerEl) state.winnerEl.classList.add('is-winner');
  outcomeText.textContent = `You ${state.statePlay}`;
  scoreEl.textContent = state.score;
  containerReset.removeAttribute('inert');
  containerReset.classList.add('outcome-view');
};

const setThemeModeInLocalStortge = theme => {
  localStorage.setItem('themeMode', JSON.stringify(theme));
};

const getThemeModeFromLS = () => {
  const data = JSON.parse(localStorage.getItem('themeMode'));
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (!data) {
    state.theme = isDarkMode
      ? ['dark', '/rock-paper-scissors/supassets/icon-moon.svg']
      : ['light', '/rock-paper-scissors/supassets/icon-sun.svg'];
    return;
  }
  state.theme = data;
};

const changeClassDoc = type => {
  document.documentElement.classList = `overflow-x-hidden ${type}`;
};

const updateDomThemeBtn = themBtn => {
  const [val, src] = themBtn;
  const typeEl = elements.themeType;
  const useEl = typeEl.closest('button').querySelector('use');
  useEl.setAttribute('href', src);
  typeEl.textContent = val;
};

const updateDomTheme = themeData => {
  const [val, src] = themeData;
  const typeEl = elements.themeType;
  const useEl = typeEl.closest('button').querySelector('use');
  changeClassDoc(val);
  useEl.setAttribute('href', src);
  typeEl.textContent = val;
};

const handlThemeToggle = () => {
  elements.themeToggle.addEventListener('click', () => {
    const typeEl = elements.themeType;
    const type = typeEl.textContent === 'dark' ? typeEl.textContent : 'light';
    const valSrc = {
      dark: ['light', '/rock-paper-scissors/supassets/icon-sun.svg'],
      light: ['dark', '/rock-paper-scissors/supassets/icon-moon.svg'],
    };
    const [val, src] = valSrc[type];
    state.theme = [val, src];
    setThemeModeInLocalStortge(state.theme);
    updateDomTheme(state.theme);
  });
};

const controlThemeModeLS = () => {
  getThemeModeFromLS();
  updateDomThemeBtn(state.theme);
};

const initEventListeners = () => {
  elements.app.addEventListener('click', async e => {
    const btnToken = e.target.closest('.token-btn');
    if (btnToken) {
      const type = btnToken.dataset.choice;
      state.playerPickType = type;
      await showTemplate(elements.resultTemplate);
      handleShowSelctedPicked(state.playerPickType);
      howWinner();
      return;
    }
    const btnReset = e.target.closest('#play-again');
    if (btnReset) showTemplate(elements.pickerTemplate);
  });
};
const init = async () => {
  controlThemeModeLS();
  showTemplate(elements.pickerTemplate);
  initEventListeners();
  handlThemeToggle();
};
init();
