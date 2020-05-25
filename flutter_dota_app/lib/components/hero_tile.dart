import 'package:flutter/material.dart';
import 'package:dota_app/model/hero.dart';
import 'package:cached_network_image/cached_network_image.dart';

class HeroTile extends StatelessWidget {
  HeroTile(this.hero, {Key key, this.onHeroSelected, this.onTap})
      : super(key: key);

  final DotaHero hero;
  final Function(DotaHero) onHeroSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        if (this.onTap != null) {
          onTap();
        }
        if (this.onHeroSelected != null) {
          this.onHeroSelected(this.hero);
        }
      },
      child: Stack(
        children: <Widget>[
          Container(
            decoration: BoxDecoration(
              image: DecorationImage(
                image: CachedNetworkImageProvider(
                  hero.imageUrl,
                ),
                fit: BoxFit.cover,
              ),
            ),
          ),
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  stops: [0.7, 1],
                  colors: [Colors.black12, Colors.black]),
            ),
          ),
          Container(
            alignment: Alignment.bottomRight,
            padding: EdgeInsets.all(8),
            child: Text(
              hero.name,
              style: Theme.of(context)
                  .textTheme
                  .subtitle
                  .copyWith(color: Colors.white),
            ),
          )
        ],
      ),
    );
  }
}
