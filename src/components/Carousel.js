import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import getAttr from '../utils/getAttr';
import isEmpty from 'lodash/isEmpty';
import findIndex from 'lodash/findIndex';
import {getSectionURL} from '../utils/section';
import {Link, withRouter} from 'react-router-dom';
import OverviewMap from './OverviewMap';
import {FormattedMessage} from 'react-intl';

export class SectionCarousel extends React.Component {
  state = {
    isMobile: typeof window !== 'undefined' && window.innerWidth < 768
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({isMobile: typeof window !== 'undefined' && window.innerWidth < 768});
  }

  render() {
    const {hearing, match: params, language} = this.props;
    const {isMobile} = this.state;

    return (
      <div className="carousel-container">
        {hearing.geojson && <HearingMap hearing={hearing} />}
        <div className="slider-container">
          <Slider
            className="slider"
            infinite={false}
            focusOnSelect
            slidesToShow={isMobile ? 1 : 4}
            autoplay={false}
            afterChange={(index) => { console.log(index) }}
            initialSlide={params.sectionSlug ? findIndex(hearing.sections, (section) => section.id === params.sectionSlug) : 0}
            ref={slider => {
              this.slider = slider;
            }}
          >
            {hearing.sections.map(
              (section) => <div key={section.id}><SliderItem hearingTitle={hearing.title} url={section.type === 'main' ? `/${hearing.slug}` : getSectionURL(hearing.slug, section)} language={language} section={section} /></div>)}
          </Slider>
        </div>
      </div>
    );
  }
}

SectionCarousel.propTypes = {
  hearing: PropTypes.object
};

export default withRouter(SectionCarousel);

const HearingMap = ({hearing}) => {
  return (
    <div className="carousel-map-container">
      <div className="carousel-map">
        <OverviewMap hearings={[hearing]} style={{width: '100%', height: '200px'}} hideIfEmpty />
      </div>
    </div>
  );
};

HearingMap.propTypes = {
  hearing: PropTypes.object
};

const SliderItem = ({section, url, language, hearingTitle}) => {
  return (
    <div className="slider-item">
      <Link to={url}>
        {!isEmpty(section.images) && <img className="slider-image" src={section.images[0].url} alt="Section"/>}
        <div className="slider-item-content">
          <div className="slider-item-title">{section.type === 'main' ? getAttr(hearingTitle, language) : getAttr(section.title, language)}</div>
        </div>
      </Link>
    </div>
  );
};


SliderItem.propTypes = {
  section: PropTypes.object,
  url: PropTypes.string,
  language: PropTypes.string,
  hearingTitle: PropTypes.object
};
