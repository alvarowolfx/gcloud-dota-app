import 'package:flutter/material.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:cached_network_image/cached_network_image.dart';

import 'package:dota_app/model/hero.dart';

class HeroPage extends StatefulWidget {
  HeroPage({Key key, this.hero}) : super(key: key);

  final DotaHero hero;

  @override
  _HeroPageState createState() => _HeroPageState();
}

class _HeroPageState extends State<HeroPage> {
  DatabaseReference heroesRef;
  DatabaseReference heroRef;
  Map<String, DotaHero> heroesCache = Map();

  @override
  void initState() {
    super.initState();
    heroesRef = FirebaseDatabase.instance.reference().child('/heroes');

    heroesRef.onValue.listen((data) {
      var heroesMap = Map.from(data.snapshot.value);
      heroesMap.keys.forEach((key) {
        var hero = DotaHero.fromMap(Map.from(heroesMap[key]));
        heroesCache[key] = hero;
      });
    });
  }

  List<Widget> _buildHeroList(List<DotaHero> heroes) {
    return heroes
        .map(
          (hero) => ListTile(
            title: Text(hero.name),
            subtitle: Text('${hero.matches} Matches'),
            trailing: Text('${hero.winRate}%'),
          ),
        )
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(this.widget.hero.name),
      ),
      body: Column(
        children: <Widget>[
          Stack(
            children: <Widget>[
              Container(
                height: 160,
                decoration: BoxDecoration(
                  image: DecorationImage(
                    image: CachedNetworkImageProvider(
                      this.widget.hero.imageUrl,
                    ),
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              Container(
                height: 160,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      stops: [0.7, 1],
                      colors: [Colors.black12, Colors.black]),
                ),
              ),
              Container(
                alignment: Alignment.bottomLeft,
                height: 160,
                padding: EdgeInsets.all(16),
                child: Text(
                  this.widget.hero.name,
                  style: Theme.of(context)
                      .textTheme
                      .display1
                      .copyWith(color: Colors.white),
                ),
              ),
            ],
          ),
          Container(
            padding: EdgeInsets.all(16),
            color: Colors.black,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                HeroData('Rank ', '${this.widget.hero.rank}º'),
                HeroData('Win Rate ', '${this.widget.hero.winRate} %')
              ],
            ),
          ),
          Expanded(
            child: ListView(
              children: <Widget>[
                Header('Best Heroes'),
                ..._buildHeroList(this.widget.hero.bestHeroes),
                Header('Worst Heroes'),
                ..._buildHeroList(this.widget.hero.worstHeroes)
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class HeroData extends StatelessWidget {
  HeroData(this.label, this.value, {Key key}) : super(key: key);

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    var style =
        Theme.of(context).textTheme.subhead.copyWith(color: Colors.white);
    return Row(
      children: <Widget>[
        Text(
          label,
          style: style.copyWith(fontWeight: FontWeight.bold),
        ),
        Text(
          value,
          style: style,
        ),
      ],
    );
  }
}

class Header extends StatelessWidget {
  Header(this.label, {Key key}) : super(key: key);

  final String label;
  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.red.withOpacity(0.5),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        mainAxisSize: MainAxisSize.max,
        children: <Widget>[
          Text(this.label,
              style: TextStyle(
                fontSize: 20.0,
                fontWeight: FontWeight.bold,
              )),
        ],
      ),
      padding: EdgeInsets.all(10.0),
    );
  }
}
