import { useState } from "react";
import { Icon } from "./Icon";
import QrCode from "./QrCode";
import {
  FOOTER_SUPPORT,
  FOOTER_ACCOUNT,
  FOOTER_LINKS,
  SOCIALS,
} from "../data/data";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setEmail("");
  };

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__col">
          <h4 className="footer__logo">Exclusive</h4>
          <h5 className="footer__title">Subscribe</h5>
          <p>Get 10% off your first order</p>
          <form className="subscribe" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" aria-label="Subscribe">
              <Icon name="send" size={22} />
            </button>
          </form>
        </div>

        <div className="footer__col">
          <h4 className="footer__title">Support</h4>
          <ul>
            {FOOTER_SUPPORT.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__title">Account</h4>
          <ul>
            {FOOTER_ACCOUNT.map((item) => (
              <li key={item}><a href="#">{item}</a></li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__title">Quick Link</h4>
          <ul>
            {FOOTER_LINKS.map((item) => (
              <li key={item}><a href="#">{item}</a></li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__title">Download App</h4>
          <p className="footer__small">Save $3 with App New User Only</p>
          <div className="apps">
            <QrCode />
            <div className="apps__stores">
              <a href="#" className="store">
                <span>GET IT ON</span>
                <strong>Google Play</strong>
              </a>
              <a href="#" className="store">
                <span>Download on the</span>
                <strong>App Store</strong>
              </a>
            </div>
          </div>
          <div className="socials">
            {SOCIALS.map((s) => (
              <a key={s} href="#" aria-label={s}>
                <Icon name={s} size={22} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <p className="footer__copy">© Copyright Rimel 2022. All right reserved</p>
    </footer>
  );
}
