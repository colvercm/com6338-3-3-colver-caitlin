const head = document.querySelector('head')
const body = document.querySelector('body')

// mocha CSS link
const mochaCSSPath = "https://cdnjs.cloudflare.com/ajax/libs/mocha/8.3.2/mocha.min.css"
const mochaCSSLinkEl = document.createElement('link')
mochaCSSLinkEl.rel = 'stylesheet'
mochaCSSLinkEl.href = mochaCSSPath
head.prepend(mochaCSSLinkEl)

// custom styles for mocha runner
const mochaStyleEl = document.createElement('style')
mochaStyleEl.innerHTML =
  `#mocha {
    font-family: sans-serif;
    position: fixed;
    overflow-y: auto;
    z-index: 1000;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 48px 0 96px;
    background: white;
    color: black;
    display: none;
    margin: 0;
  }
  #mocha * {
    letter-spacing: normal;
    text-align: left;
  }
  #mocha .replay {
    pointer-events: none;
  }
  #mocha-test-btn {
    position: fixed;
    bottom: 50px;
    right: 50px;
    z-index: 1001;
    background-color: #007147;
    border: #009960 2px solid;
    color: white;
    font-size: initial;
    border-radius: 4px;
    padding: 12px 24px;
    transition: 200ms;
    cursor: pointer;
  }
  #mocha-test-btn:hover:not(:disabled) {
    background-color: #009960;
  }
  #mocha-test-btn:disabled {
    background-color: grey;
    border-color: grey;
    cursor: initial;
    opacity: 0.7;
  }`
head.appendChild(mochaStyleEl)

// mocha div
const mochaDiv = document.createElement('div')
mochaDiv.id = 'mocha'
body.appendChild(mochaDiv)

// run tests button
const testBtn = document.createElement('button')
testBtn.textContent = "Loading Tests"
testBtn.id = 'mocha-test-btn'
testBtn.disabled = true
body.appendChild(testBtn)

const scriptPaths = [
  "https://cdnjs.cloudflare.com/ajax/libs/mocha/8.3.2/mocha.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/chai/4.3.4/chai.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/sinon.js/10.0.1/sinon.min.js",
  // "jsdom.js" // npx browserify _jsdom.js --standalone JSDOM -o jsdom.js
]
const scriptTags = scriptPaths.map(path => {
  const scriptTag = document.createElement('script')
  scriptTag.type = 'text/javascript'
  scriptTag.src = path
  return scriptTag
})

let loaded = 0
if (localStorage.getItem('test-run')) {
  // lazy load test dependencies
  scriptTags.forEach(tag => {
    body.appendChild(tag)
    tag.onload = function () {
      if (loaded !== scriptTags.length - 1) {
        loaded++
        return
      }
      testBtn.textContent = 'Run Tests'
      testBtn.disabled = false
      testBtn.onclick = __handleClick
      runTests()
    }
  })
} else {
  testBtn.textContent = 'Run Tests'
  testBtn.disabled = false
  testBtn.onclick = __handleClick
}

function __handleClick() {
  if (!localStorage.getItem('test-run') && this.textContent === 'Run Tests') {
    localStorage.setItem('test-run', true)
  } else {
    localStorage.removeItem('test-run')
  }
  window.location.reload()
}

function runTests() {
  testBtn.textContent = 'Running Tests'
  testBtn.disabled = true
  mochaDiv.style.display = 'block'
  body.style.overflow = 'hidden'

  mocha.setup("bdd");
  const expect = chai.expect;

  describe("Personality Test Practice", function () {
    let startBtn = document.querySelector('button')
    let alertStub
    let confirmStub
    const stubConfirm = bools => {
      if (confirmStub) confirmStub.restore()
      confirmStub = sinon.stub(window, 'confirm')
      for (const [i, bool] of Object.entries(bools)) {
        confirmStub.onCall(i).returns(bool)
      }
    }
    beforeEach(() => {
      alertStub = sinon.stub(window, 'alert')
      stubConfirm(new Array(5).fill(false))
    })
    afterEach(sinon.restore)
    after(() => {
      testBtn.disabled = false
      testBtn.textContent = 'Close Tests'
    })
    it('should have a start button', () => {
      expect(startBtn).to.exist
      expect(startBtn).to.not.eq(testBtn)
      expect(startBtn.textContent.toLowerCase())
        .to.include('start')
    })
    it('should ask the user 5 questions using confirm', () => {
      startBtn.click()
      expect(confirmStub.callCount).to.eq(5)
    })
    it('should alert user they are an optimist if they agree with all statements', () => {
      stubConfirm(new Array(5).fill(true))
      startBtn.click()
      expect(alertStub.called).to.be.true
      expect(alertStub.firstCall.args[0].toLowerCase())
        .to.contain('optimist')
    })
    it('should alert user they are an optimist if they agree with 3/5 statements', () => {
      stubConfirm([true, true, false, true, false])
      startBtn.click()
      expect(alertStub.called).to.be.true
      expect(alertStub.firstCall.args[0].toLowerCase())
      .to.contain('optimist')
    })
    it('should alert user they are a pessimist if they disagree with all statements', () => {
      startBtn.click()
      expect(alertStub.called).to.be.true
      expect(alertStub.firstCall.args[0].toLowerCase())
        .to.contain('pessimist')
    })
    it('should alert user they are an pessimist if they disagree with 3/5 statements', () => {
      stubConfirm([false, false, true, true, false])
      startBtn.click()
      expect(alertStub.called).to.be.true
      expect(alertStub.firstCall.args[0].toLowerCase())
        .to.contain('pessimist')
    })
  });

  mocha.run();
}