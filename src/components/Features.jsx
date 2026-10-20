import { Icon } from "./Icon";
import { FEATURES } from "../data/data";

export default function Features() {
  return (
    <section className="features">
      {FEATURES.map((f) => (
        <div key={f.title} className="feature">
          <span className="feature__icon">
            <span className="feature__icon-inner">
              <Icon name={f.icon} size={32} />
            </span>
          </span>
          <h3 className="feature__title">{f.title}</h3>
          <p className="feature__text">{f.text}</p>
        </div>
      ))}
    </section>
  );
}
