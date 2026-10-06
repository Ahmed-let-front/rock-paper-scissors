import scissorsIcon from '../assets/images/icon-scissors.svg';
import paperIcon from '../assets/images/icon-paper.svg';
import rockIcon from '../assets/images/icon-rock.svg';
import lizardIcon from '../assets/images/icon-lizard.svg';
import spockIcon from '../assets/images/icon-spock.svg';
const icons = {
  scissors: scissorsIcon,
  paper: paperIcon,
  rock: rockIcon,
  lizard: lizardIcon,
  spock: spockIcon,
};
const elements = {
  pickerTemplate: document.getElementById('picker-template'),
  resultTemplate: document.getElementById('result-template'),
  app: document.getElementById('main'),
};
const state = {
  playerPickType: '',
  housePick: '',
};
const removeCurrentView = callback => {
  return new Promise(resolve => {
    const currentView = elements.app.querySelector('.template-view');
    if (!currentView) {
      if (callback) callback();
      resolve();
      return;
    }
    currentView.classList.add('template-close');
    setTimeout(() => {
      currentView.remove();
      callback();
      resolve();
    }, 1000);
  });
};
const appendNewTemplate = template => {
  const clone = template.content.cloneNode(true);
  elements.app.appendChild(clone);
};
const showTemplate = async template => {
  await removeCurrentView(() => {
    appendNewTemplate(template);
  });
};
const handleClickInToken = () => {
  elements.app.addEventListener('click', async e => {
    const btn = e.target.closest('.token-btn');
    if (!btn) return;
    const type = btn.dataset.choice;
    state.playerPickType = type;
    await showTemplate(elements.resultTemplate);
    handleShowSelctedPicked(state.playerPickType);
  });
};
const handleShowSelctedPicked = type => {
  const HTML = `
 <div
    class="token token-${type} size-28 shrink-0 rounded-full min-[375px]:size-32 md:size-48 lg:size-[18.3rem]"
    >
     <span class="token-face">
       <img
        src="${icons[type]}"
        alt="Scissors"
        class="token-icon"
         />
     </span>
</div>
    `;
  const resultTemplate = document.getElementById('result');
  console.log(resultTemplate);
  if (!resultTemplate) return;
  const playerPick = resultTemplate.querySelector('#player-pick');
  playerPick.innerHTML = HTML;
};
const init = async () => {
  await showTemplate(elements.pickerTemplate);
  handleClickInToken();
};
init();
