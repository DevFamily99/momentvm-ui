import React, { useState, FC } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import PlaceholderSvg from '../images/module-placeholder.svg';

// import placeholderImage from '../images/page-tile-placeholder.png';
interface ImageProps {
  src: string;
  alt: string;
}

/**
 * Shows a placeholder image until the provided image loads
 * @param src string
 * @param alt string
 */
const Image: FC<ImageProps> = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const data = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "page-tile-placeholder.png" }) {
        childImageSharp {
          # Specify the image processing specifications right in the query.
          # Makes it trivial to update as your page's design changes.
          fixed(width: 125, height: 125) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `);

  const imageStyle = !loaded ? { display: 'none' } : {};
  return (
    <>
      {!loaded && <PlaceholderSvg style={{ width: '100%', height: '100%' }} />}
      <img src={`${src}`} alt={alt} style={imageStyle} onLoad={() => setLoaded(true)} />
    </>
  );
};

export default Image;
