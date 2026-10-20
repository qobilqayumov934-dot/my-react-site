import { Icon, AppleLogo } from "./Icon";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__text">
        <div className="hero__brand">
          <AppleLogo size={40} />
          <span>iPhone 14 Series</span>
        </div>
        <h1 className="hero__title">
          Up to 10%
          <br />
          off Voucher
        </h1>
        <a href="#products" className="hero__link">
          Shop Now <Icon name="right" size={24} />
        </a>
      </div>

      <div className="phone" aria-hidden="true">
        <img src="./1.png" alt="" />
      </div>
    </section>
  );
}
